const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getAnalytics
} = require('../controllers/leadController');

const router = express.Router();

router.use(protect);

router.get('/', getLeads);
router.get('/analytics', getAnalytics);
router.post('/', createLead);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
