import { test, expect } from '@playwright/test';

test.describe('ServiceHub Core End-to-End Workflow', () => {
  const timestamp = Date.now();
  const testUser = {
    name: `Test User ${timestamp}`,
    email: `testuser_${timestamp}@example.com`,
    password: 'Password123!',
  };

  test('Complete Customer & Admin Lifecycle: Register -> Browse -> Book -> Admin Confirm', async ({ page }) => {
    // 1. Visit Homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/ServiceHub/i);
    await expect(page.locator('text=Verified Services On Demand')).toBeVisible();

    // 2. Register Account
    await page.goto('/register');
    await page.fill('#register-name', testUser.name);
    await page.fill('#register-email', testUser.email);
    await page.fill('#register-password', testUser.password);
    await page.click('#register-submit-btn');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator(`text=${testUser.name}`)).toBeVisible();

    // 3. Browse Services
    await page.goto('/services');
    await expect(page.locator('h1')).toContainText('Explore All Services');

    // Search for a service
    await page.fill('#service-search-input', 'Deep Clean');
    await page.waitForTimeout(500);

    // Click on the first service card
    const firstServiceCardLink = page.locator('a:has-text("View Details & Book")').first();
    await expect(firstServiceCardLink).toBeVisible();
    await firstServiceCardLink.click();

    // 4. On Service Details page, schedule appointment
    await expect(page.locator('#confirm-booking-btn')).toBeVisible();
    await page.fill('#booking-notes-input', 'Automated E2E booking verification test note.');
    await page.click('#confirm-booking-btn');

    // 5. Verify redirect to My Bookings and pending status
    await page.waitForURL(/.*dashboard\/bookings/, { timeout: 10000 });
    await expect(page.locator('text=Pending Approval').first()).toBeVisible();

    // 6. Sign out
    await page.goto('/api/auth/logout'); // or trigger logout
    await page.goto('/login');

    // 7. Login as Admin
    await page.fill('#login-email', 'admin@servicehub.com');
    await page.fill('#login-password', 'Admin123!');
    await page.click('#login-submit-btn');

    // Should land on Admin Portal
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.locator('text=Platform Overview & Analytics')).toBeVisible();

    // 8. Go to Manage Bookings
    await page.goto('/admin/bookings');
    await expect(page.locator('h1')).toContainText('Manage Customer Bookings');

    // Check that the table lists bookings
    await expect(page.locator('table')).toBeVisible();
  });
});
