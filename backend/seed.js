const mongoose = require('mongoose');
const Lead = require('./models/Lead');
require('dotenv').config();

const firstNames = [
  'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jessica',
  'James', 'Jennifer', 'Daniel', 'Amanda', 'Matthew', 'Michelle', 'Joseph',
  'Lauren', 'Christopher', 'Rebecca', 'Andrew', 'Lisa'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

const companies = [
  'Acme Corp', 'Tech Solutions Inc', 'Digital Innovations', 'Global Enterprises',
  'Future Systems', 'NextGen Technologies', 'CloudBase Inc', 'DataCore Solutions',
  'Innovation Labs', 'Smart Systems Ltd', 'ProTech Solutions', 'DigitalWorks',
  'TechVision Corp', 'EliteServices Inc', 'PowerInnovate', 'Enterprise Solutions',
  'StreamTech Inc', 'VisionCore Systems', 'TechForward Ltd', 'GrowthDynamics'
];

const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const sources = ['Website', 'Email', 'Social Media', 'Referral', 'Event', 'Other'];
const jobTitles = ['Manager', 'Developer', 'Designer', 'Product Manager', 'CEO', 'CTO', 'CFO', 'Sales Manager', 'HR Manager', 'Marketing Manager'];

const generateDummyLeads = (count) => {
  const leads = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];

    leads.push({
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      stage,
      source: sources[Math.floor(Math.random() * sources.length)],
      value: Math.floor(Math.random() * 100000) + 5000,
      notes: `Lead generated for ${firstName} at a potential opportunity`,
      lastContactDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      convertedDate: stage === 'Won' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
      status: Math.random() > 0.2 ? 'Active' : 'Inactive'
    });
  }
  return leads;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected');

    // Clear existing leads
    await Lead.deleteMany({});
    console.log('Cleared existing leads');

    // Generate and insert dummy leads
    const dummyLeads = generateDummyLeads(500);
    await Lead.insertMany(dummyLeads);
    console.log(`Inserted ${dummyLeads.length} dummy leads`);

    // Also create a default user
    const User = require('./models/User');
    await User.deleteMany({});
    await User.create({
      username: 'demo',
      email: 'demo@example.com',
      password: 'demo123',
      fullName: 'Demo User',
      role: 'admin'
    });
    console.log('Created default demo user');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
