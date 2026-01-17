const Lead = require('../models/Lead');

// GET all leads with search, filters, sorting, and pagination
exports.getLeads = async (req, res) => {
  try {
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

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    if (stage) filter.stage = stage;
    if (source) filter.source = source;
    if (status) filter.status = status;

    // Sorting
    const sortObj = {};
    sortObj[sortBy] = order === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const leads = await Lead.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE a new lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE a lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE a lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET analytics metrics
exports.getAnalytics = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const convertedLeads = await Lead.countDocuments({ stage: 'Won' });
    const stageDistribution = await Lead.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const sourceDistribution = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalValue = await Lead.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$value' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        convertedLeads,
        conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) + '%' : '0%',
        totalValue: totalValue[0]?.total || 0,
        stageDistribution,
        sourceDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
