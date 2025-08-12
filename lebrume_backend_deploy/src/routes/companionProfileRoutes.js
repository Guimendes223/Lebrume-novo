const express = require('express');
const router = express.Router();
const { 
  getCompanionProfileById, 
  getMyCompanionProfile, 
  upsertMyCompanionProfile,
  searchCompanionProfiles
} = require('../controllers/companionProfileController');

const { protect, authorize } = require('../middleware/combinedMiddleware');

// Rotas públicas (não precisa de autenticação)
router.get('/search', searchCompanionProfiles);
router.get('/:id', getCompanionProfileById);

// Rotas protegidas para Companion
router.get('/me', protect, authorize("Companion"), getMyCompanionProfile);
router.put('/me', protect, authorize("Companion"), upsertMyCompanionProfile);

module.exports = router;
