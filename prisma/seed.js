const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ServiceHub database seed...');

  // Clean existing records in reverse dependency order
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const hashedPasswordAdmin = await bcrypt.hash('Admin123!', 10);
  const hashedPasswordCustomer = await bcrypt.hash('Customer123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'ServiceHub Admin',
      email: 'admin@servicehub.com',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
      phone: '+1 (555) 019-2834',
      address: '100 Tech Blvd, Suite 400, San Francisco, CA',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'customer@servicehub.com',
      password: hashedPasswordCustomer,
      role: 'CUSTOMER',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Springfield, OR',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      password: hashedPasswordCustomer,
      role: 'CUSTOMER',
      phone: '+1 (555) 876-5432',
      address: '124 Conch Street, Pacific Grove, CA',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    },
  });

  console.log('✅ Created 3 initial users (1 Admin, 2 Customers)');

  // 2. Create Categories
  const categoriesData = [
    {
      name: 'Home Cleaning',
      slug: 'home-cleaning',
      description: 'Comprehensive residential, apartment, and deep cleaning services by verified experts.',
      icon: 'Sparkles',
    },
    {
      name: 'Plumbing',
      slug: 'plumbing',
      description: 'Expert pipe repairs, leak detections, fixture installations, and emergency drain solutions.',
      icon: 'Wrench',
    },
    {
      name: 'Electrical',
      slug: 'electrical',
      description: 'Licensed electricians for wiring, panel upgrades, smart fixtures, and safety inspections.',
      icon: 'Zap',
    },
    {
      name: 'HVAC & Climate',
      slug: 'hvac-climate',
      description: 'Air conditioning, furnace maintenance, thermostat upgrades, and duct inspections.',
      icon: 'Wind',
    },
    {
      name: 'Appliance Repair',
      slug: 'appliance-repair',
      description: 'Diagnostics and repair for refrigerators, washing machines, ovens, and dishwashers.',
      icon: 'Cpu',
    },
    {
      name: 'Handyman & Painting',
      slug: 'handyman-painting',
      description: 'Drywall repair, interior painting, furniture assembly, and general home improvements.',
      icon: 'Paintbrush',
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created;
  }
  console.log(`✅ Created ${categoriesData.length} service categories`);

  // 3. Create Services
  const servicesData = [
    {
      categoryId: categories['home-cleaning'].id,
      name: 'Standard Home Deep Clean',
      slug: 'standard-home-deep-clean',
      description: 'Thorough cleaning of living rooms, bedrooms, kitchen counters, exterior appliances, and bathrooms using eco-friendly solutions.',
      price: 129.99,
      durationMinutes: 180,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    },
    {
      categoryId: categories['home-cleaning'].id,
      name: 'Move-in / Move-out Sanitization',
      slug: 'move-in-move-out-sanitization',
      description: 'Full property turnover cleaning including inside cabinets, baseboards, deep oven cleaning, and window interiors.',
      price: 219.0,
      durationMinutes: 240,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
    },
    {
      categoryId: categories['plumbing'].id,
      name: 'Emergency Drain Unclogging',
      slug: 'emergency-drain-unclogging',
      description: 'High-power snaking and camera inspection for clogged sinks, main sewer lines, toilets, and showers.',
      price: 99.5,
      durationMinutes: 60,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    },
    {
      categoryId: categories['plumbing'].id,
      name: 'Water Heater Diagnostic & Flush',
      slug: 'water-heater-diagnostic-flush',
      description: 'Complete inspection of burner, thermostat, pressure valve, and sediment flush to restore peak heating efficiency.',
      price: 149.0,
      durationMinutes: 90,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    },
    {
      categoryId: categories['electrical'].id,
      name: 'Smart Thermostat & Lighting Setup',
      slug: 'smart-thermostat-lighting-setup',
      description: 'Certified installation and WiFi integration of smart thermostats (Nest/Ecobee) and recessed LED dimmer packs.',
      price: 110.0,
      durationMinutes: 75,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    },
    {
      categoryId: categories['electrical'].id,
      name: 'Circuit Breaker & Electrical Panel Inspection',
      slug: 'breaker-panel-inspection',
      description: 'Full code-compliance safety audit, load testing, breaker diagnostics, and thermal hotspot checks.',
      price: 175.0,
      durationMinutes: 120,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    },
    {
      categoryId: categories['hvac-climate'].id,
      name: 'AC Precision Tune-Up & Refrigerant Check',
      slug: 'ac-precision-tune-up',
      description: 'Coil cleaning, electrical terminal check, motor lubrication, filter change, and coolant pressure check.',
      price: 135.0,
      durationMinutes: 90,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1631545648833-286f0ff524df?auto=format&fit=crop&w=800&q=80',
    },
    {
      categoryId: categories['appliance-repair'].id,
      name: 'Refrigerator Cooling & Compressor Diagnostics',
      slug: 'refrigerator-cooling-diagnostics',
      description: 'Diagnostics for defrost timers, compressor relays, condenser fan motors, and cold control thermostats.',
      price: 89.0,
      durationMinutes: 60,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
    },
    {
      categoryId: categories['handyman-painting'].id,
      name: 'Interior Accent Wall & Trim Painting',
      slug: 'interior-accent-wall-painting',
      description: 'Two coats of premium latex paint with surface priming, caulk repair, and edge taping included.',
      price: 250.0,
      durationMinutes: 240,
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const createdServices = [];
  for (const s of servicesData) {
    const svc = await prisma.service.create({ data: s });
    createdServices.push(svc);
  }
  console.log(`✅ Created ${createdServices.length} realistic services`);

  // 4. Create Sample Bookings across all statuses
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 5);

  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 7);

  const bookingsData = [
    {
      userId: customer1.id,
      serviceId: createdServices[0].id, // Deep clean
      bookingDate: tomorrow,
      timeSlot: '10:00 AM',
      notes: 'Please pay extra attention to the master bathroom and kitchen stovetop.',
      totalPrice: createdServices[0].price,
      status: 'CONFIRMED',
    },
    {
      userId: customer1.id,
      serviceId: createdServices[2].id, // Drain unclog
      bookingDate: nextWeek,
      timeSlot: '02:00 PM',
      notes: 'Front doorbell is broken, please knock loudly.',
      totalPrice: createdServices[2].price,
      status: 'PENDING',
    },
    {
      userId: customer1.id,
      serviceId: createdServices[4].id, // Smart thermostat
      bookingDate: pastDate,
      timeSlot: '11:00 AM',
      notes: 'Installed Ecobee 4 with 2 room sensors.',
      totalPrice: createdServices[4].price,
      status: 'COMPLETED',
    },
    {
      userId: customer2.id,
      serviceId: createdServices[1].id, // Move in clean
      bookingDate: pastDate,
      timeSlot: '09:00 AM',
      notes: 'Customer cancelled due to delayed moving truck.',
      totalPrice: createdServices[1].price,
      status: 'CANCELLED',
      cancellationReason: 'Customer requested cancellation: Moving truck delayed.',
    },
  ];

  for (const b of bookingsData) {
    await prisma.booking.create({ data: b });
  }
  console.log(`✅ Created ${bookingsData.length} sample bookings with full status variety`);

  console.log('🎉 Seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Admin Account:    admin@servicehub.com / Admin123!');
  console.log('Customer Account: customer@servicehub.com / Customer123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
