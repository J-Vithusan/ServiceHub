# ServiceHub REST API Specification

Comprehensive documentation of all REST API endpoints implemented in ServiceHub, including required permissions, input parameters, response schemas, and HTTP status codes.

---

## 1. Authentication & Security Model

- **Session Type**: Cryptographically signed JSON Web Token (JWT) using `jose` with HS256 algorithm.
- **Storage**: Sent in `httpOnly`, `sameSite: "lax"`, `path: "/"` cookie named `servicehub_session`.
- **Role Verification**: Handled strictly on the server per request. `ADMIN` role is required for management mutations.

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
Creates a new customer or administrator account and issues an authenticated session cookie.

- **Access**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123!",
  "role": "CUSTOMER",
  "phone": "+1 (555) 019-2834",
  "address": "742 Evergreen Terrace, Springfield, OR"
}
```
- **Responses**:
  - `201 Created`:
  ```json
  {
    "message": "Account registered successfully",
    "user": {
      "id": "cuid123",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "CUSTOMER",
      "avatarUrl": null
    }
  }
  ```
  - `400 Bad Request`: Email already registered or invalid fields.

---

### `POST /api/auth/login`
Validates user credentials and issues a session cookie.

- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@servicehub.com",
  "password": "Admin123!"
}
```
- **Responses**:
  - `200 OK`:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "admin-cuid",
      "name": "ServiceHub Admin",
      "email": "admin@servicehub.com",
      "role": "ADMIN"
    }
  }
  ```
  - `401 Unauthorized`: Invalid credentials.

---

### `POST /api/auth/logout`
Destroys the session cookie.

- **Access**: Public
- **Responses**:
  - `200 OK`: `{ "message": "Logged out successfully" }`

---

### `GET /api/auth/me`
Retrieves current authenticated session details.

- **Access**: Public (returns `user: null` if unauthenticated)
- **Responses**:
  - `200 OK`: `{ "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }`

---

## 3. Services Endpoints

### `GET /api/services`
Retrieves active services (or all services for administrators) with multi-criteria filtering.

- **Access**: Public
- **Query Parameters**:
  - `search` (optional): Matches keyword in name or description
  - `category` (optional): Filter by category slug (e.g. `plumbing`)
  - `categoryId` (optional): Filter by category ID
  - `status` (optional, admin only): `ACTIVE`, `INACTIVE`, or `ALL`
  - `minPrice` / `maxPrice` (optional): Numeric price filter
  - `sort` (optional): `price-asc`, `price-desc`, `newest`, `name-asc`
- **Responses**:
  - `200 OK`:
  ```json
  {
    "services": [
      {
        "id": "clx...",
        "name": "Standard Home Deep Clean",
        "slug": "standard-home-deep-clean",
        "price": 129.99,
        "durationMinutes": 180,
        "status": "ACTIVE",
        "category": { "name": "Home Cleaning", "slug": "home-cleaning" }
      }
    ]
  }
  ```

---

### `GET /api/services/:id`
Retrieves single service detail by either ID or slug.

- **Access**: Public
- **Responses**:
  - `200 OK`: `{ "service": { ... } }`
  - `404 Not Found`: Service not found.

---

### `POST /api/services`
Creates a new service in the catalog.

- **Access**: Protected (`ADMIN` only)
- **Request Body**:
```json
{
  "name": "Emergency Pipe Repair",
  "categoryId": "cat-plumbing-id",
  "description": "Comprehensive pipe leak diagnosis and heavy-duty clamp repair.",
  "price": 149.00,
  "durationMinutes": 90,
  "status": "ACTIVE",
  "imageUrl": "https://images.unsplash.com/..."
}
```
- **Responses**:
  - `201 Created`: `{ "service": { ... } }`
  - `403 Forbidden`: Admin role required.

---

### `PUT /api/services/:id`
Updates an existing service.

- **Access**: Protected (`ADMIN` only)
- **Responses**:
  - `200 OK`: Returns updated service record.
  - `404 Not Found`: Service not found.

---

### `DELETE /api/services/:id`
Permanently deletes a service.

- **Access**: Protected (`ADMIN` only)
- **Responses**:
  - `200 OK`: `{ "message": "Service successfully deleted." }`

---

## 4. Bookings Endpoints

### `GET /api/bookings`
Retrieves customer's own bookings or all platform bookings (for administrators).

- **Access**: Protected (Authenticated Customer or Admin)
- **Query Parameters**:
  - `status`: Filter by `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`
  - `search` (admin only): Search by customer name, email, or service
- **Responses**:
  - `200 OK`: `{ "bookings": [ ... ] }`

---

### `POST /api/bookings`
Schedules and places a new booking.

- **Access**: Protected (Customer)
- **Business Rule Checks**:
  1. Validates date is today or future.
  2. Confirms service is `ACTIVE`.
  3. Rejects if user already has an active booking for that service & time slot.
  4. Rejects if the exact time slot is already confirmed.
- **Request Body**:
```json
{
  "serviceId": "svc-123",
  "bookingDate": "2026-10-15",
  "timeSlot": "10:00 AM",
  "notes": "Please knock on side gate."
}
```
- **Responses**:
  - `201 Created`: `{ "message": "Booking successfully submitted!", "booking": { ... } }`
  - `400 Bad Request`: Past date or invalid input.
  - `409 Conflict`: Double-booking detected.

---

### `GET /api/bookings/:id`
Retrieves single booking details.

- **Access**: Protected (Owner or Admin)
- **Responses**:
  - `200 OK`: `{ "booking": { ... } }`
  - `403 Forbidden`: Unauthorized user.

---

### `PUT /api/bookings/:id`
Updates booking status with strict state machine validation.

- **Access**: Protected
  - Customer: Can only change status to `CANCELLED` on `PENDING`/`CONFIRMED` bookings.
  - Admin: Can transition `PENDING` $\to$ `CONFIRMED` or `CANCELLED`, and `CONFIRMED` $\to$ `COMPLETED` or `CANCELLED`.
- **Request Body**:
```json
{
  "status": "CONFIRMED",
  "cancellationReason": null
}
```
- **Responses**:
  - `200 OK`: Updated booking record.
  - `400 Bad Request`: Illegal status jump (e.g. from `COMPLETED` or `CANCELLED`).
  - `403 Forbidden`: Customers attempting to confirm or complete.

---

### `DELETE /api/bookings/:id`
Cancels booking.

- **Access**: Protected (Owner or Admin)
- **Responses**:
  - `200 OK`: `{ "message": "Booking cancelled successfully." }`

---

## 5. User Profile Endpoints

### `GET /api/profile`
Retrieves profile of the authenticated user.

- **Access**: Protected
- **Responses**:
  - `200 OK`: `{ "user": { "id": "...", "name": "...", "email": "...", "phone": "...", "address": "..." } }`

---

### `PUT /api/profile`
Updates contact information and preferences.

- **Access**: Protected
- **Request Body**:
```json
{
  "name": "Jane Doe Updated",
  "phone": "+1 (555) 234-9999",
  "address": "456 Oak Avenue, Portland, OR",
  "avatarUrl": "https://..."
}
```
- **Responses**:
  - `200 OK`: Updated user profile & refreshed session token.

---

## 6. Admin Management Endpoints

### `GET /api/admin/stats`
Aggregates platform KPI metrics and status distribution.

- **Access**: Protected (`ADMIN` only)
- **Responses**:
  - `200 OK`:
  ```json
  {
    "metrics": {
      "totalBookings": 48,
      "totalRevenue": 6124.50,
      "activeServicesCount": 9,
      "totalCustomersCount": 35,
      "statusBreakdown": {
        "PENDING": 4,
        "CONFIRMED": 12,
        "COMPLETED": 28,
        "CANCELLED": 4
      }
    },
    "recentBookings": [ ... ]
  }
  ```

---

### `GET /api/admin/users`
Lists all customers and administrators with booking volume and contact data.

- **Access**: Protected (`ADMIN` only)
- **Query Parameters**:
  - `role`: Filter by `CUSTOMER` or `ADMIN`
  - `search`: Filter by name, email, or phone
- **Responses**:
  - `200 OK`: `{ "users": [ ... ] }`
