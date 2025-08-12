const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/combinedMiddleware');
const {
  getDashboardStats,
  getAllCompanionProfiles,
  getCompanionProfileForReview,
  approveRejectProfile,
  updateCompanionProfile,
  deleteCompanionProfile,
  getAllUsers
} = require('../controllers/adminController');

// Dashboard statistics
router.get('/admin/stats', protect, authorize('Admin'), getDashboardStats);

// Companion profile management
router.get('/admin/companions', protect, authorize('Admin'), getAllCompanionProfiles);
router.get('/admin/companions/:id', protect, authorize('Admin'), getCompanionProfileForReview);
router.put('/admin/companions/:id/approval', protect, authorize('Admin'), approveRejectProfile);
router.put('/admin/companions/:id', protect, authorize('Admin'), updateCompanionProfile);
router.delete('/admin/companions/:id', protect, authorize('Admin'), deleteCompanionProfile);

// User management
router.get('/admin/users', protect, authorize('Admin'), getAllUsers);

module.exports = router;

