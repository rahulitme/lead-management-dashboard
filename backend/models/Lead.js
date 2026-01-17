const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, index: true },
    company: { type: String, index: true },
    jobTitle: String,
    stage: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
      default: 'New',
      index: true
    },
    source: {
      type: String,
      enum: ['Website', 'Email', 'Social Media', 'Referral', 'Event', 'Other'],
      default: 'Website',
      index: true
    },
    value: { type: Number, default: 0 },
    notes: String,
    lastContactDate: { type: Date, index: true },
    convertedDate: Date,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
