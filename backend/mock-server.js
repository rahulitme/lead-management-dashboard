const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data - 500+ leads
const generateMockLeads = (count) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jessica', 'James', 'Jennifer'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const companies = ['Acme Corp', 'Tech Solutions', 'Digital Innovations', 'Global Enterprises', 'Future Systems', 'NextGen Tech', 'CloudBase', 'DataCore', 'Innovation Labs', 'Smart Systems'];
  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const sources = ['Website', 'Email', 'Social Media', 'Referral', 'Event', 'Other'];
  const jobTitles = ['Manager', 'Developer', 'Designer', 'Product Manager', 'CEO', 'CTO', 'CFO', 'Sales Manager', 'HR Manager', 'Marketing Manager'];

  const leads = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    
    leads.push({
      _id: `${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      stage,
      source: sources[Math.floor(Math.random() * sources.length)],
      value: Math.floor(Math.random() * 100000) + 5000,
      notes: `Mock lead for ${firstName} - testing purpose`,
      lastContactDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      convertedDate: stage === 'Won' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
      status: Math.random() > 0.2 ? 'Active' : 'Inactive',
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    });
  }
  return leads;
};

let mockLeads = generateMockLeads(500);

// Mock Users
const mockUsers = {
  'demo': {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    fullName: 'Demo User',
    password: 'demo123'
  }
};

// Mock Tokens
const mockTokens = {};

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, fullName } = req.body;
  
  if (mockUsers[username]) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    fullName,
    password
  };
  
  mockUsers[username] = newUser;
  const token = `mock_token_${Date.now()}`;
  mockTokens[token] = username;

  res.status(201).json({
    success: true,
    token,
    user: { id: newUser.id, username: newUser.username, email: newUser.email, fullName: newUser.fullName }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide username and password' });
  }

  const user = mockUsers[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = `mock_token_${Date.now()}`;
  mockTokens[token] = username;

  res.status(200).json({
    success: true,
    token,
    user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName }
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || !mockTokens[token]) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  const username = mockTokens[token];
  const user = mockUsers[username];
  res.status(200).json({ success: true, data: user });
});

// Leads Routes
app.get('/api/leads', (req, res) => {
  const {
    search = '',
    stage = '',
    source = '',
    status = '',
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 20
  } = req.query;

  // Apply filters
  let filtered = mockLeads.filter(lead => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (!(`${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchLower) ||
            lead.email.toLowerCase().includes(searchLower) ||
            lead.company.toLowerCase().includes(searchLower))) {
        return false;
      }
    }
    if (stage && lead.stage !== stage) return false;
    if (source && lead.source !== source) return false;
    if (status && lead.status !== status) return false;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Paginate
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;
  const paginatedLeads = filtered.slice(skip, skip + limitNum);

  res.status(200).json({
    success: true,
    data: paginatedLeads,
    pagination: {
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(filtered.length / limitNum)
    }
  });
});

app.get('/api/leads/:id', (req, res) => {
  const lead = mockLeads.find(l => l._id === req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }
  res.status(200).json({ success: true, data: lead });
});

app.post('/api/leads', (req, res) => {
  const newLead = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockLeads.push(newLead);
  res.status(201).json({ success: true, data: newLead });
});

app.put('/api/leads/:id', (req, res) => {
  const leadIndex = mockLeads.findIndex(l => l._id === req.params.id);
  if (leadIndex === -1) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }
  
  mockLeads[leadIndex] = { ...mockLeads[leadIndex], ...req.body, updatedAt: new Date() };
  res.status(200).json({ success: true, data: mockLeads[leadIndex] });
});

app.delete('/api/leads/:id', (req, res) => {
  const leadIndex = mockLeads.findIndex(l => l._id === req.params.id);
  if (leadIndex === -1) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }
  
  const deletedLead = mockLeads.splice(leadIndex, 1);
  res.status(200).json({ success: true, data: {} });
});

app.get('/api/leads/analytics', (req, res) => {
  const totalLeads = mockLeads.length;
  const convertedLeads = mockLeads.filter(l => l.stage === 'Won').length;
  const totalValue = mockLeads.reduce((sum, l) => sum + l.value, 0);
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : '0';

  const stageDistribution = {};
  mockLeads.forEach(lead => {
    stageDistribution[lead.stage] = (stageDistribution[lead.stage] || 0) + 1;
  });

  const sourceDistribution = {};
  mockLeads.forEach(lead => {
    sourceDistribution[lead.source] = (sourceDistribution[lead.source] || 0) + 1;
  });

  res.status(200).json({
    success: true,
    data: {
      totalLeads,
      convertedLeads,
      conversionRate: conversionRate + '%',
      totalValue,
      stageDistribution: Object.entries(stageDistribution).map(([_id, count]) => ({ _id, count })),
      sourceDistribution: Object.entries(sourceDistribution).map(([_id, count]) => ({ _id, count }))
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Mock server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on port ${PORT}`);
  console.log(`📊 Loaded ${mockLeads.length} mock leads`);
  console.log(`✅ Demo credentials: username=demo, password=demo123`);
});
