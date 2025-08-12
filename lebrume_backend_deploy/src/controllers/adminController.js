const { CompanionProfile, User, Service, Message, Rating } = require('../models');
const { Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin role)
const getDashboardStats = async (req, res, next) => {
  try {
    // Ensure user is admin
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Get profile statistics
    const totalProfiles = await CompanionProfile.count();
    const pendingProfiles = await CompanionProfile.count({
      where: { 
        isApproved: false,
        profileCompleteness: { [Op.gte]: 70 }
      }
    });
    const approvedProfiles = await CompanionProfile.count({
      where: { isApproved: true }
    });
    const rejectedProfiles = await CompanionProfile.count({
      where: { 
        isApproved: false,
        rejectionReason: { [Op.not]: null }
      }
    });

    // Get user statistics
    const totalUsers = await User.count();
    const companionUsers = await User.count({
      where: { userType: 'Companion' }
    });
    const clientUsers = await User.count({
      where: { userType: 'Client' }
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProfiles = await CompanionProfile.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    const recentUsers = await User.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    res.json({
      profiles: {
        total: totalProfiles,
        pending: pendingProfiles,
        approved: approvedProfiles,
        rejected: rejectedProfiles,
        recentlyCreated: recentProfiles
      },
      users: {
        total: totalUsers,
        companions: companionUsers,
        clients: clientUsers,
        recentlyRegistered: recentUsers
      },
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    next(error);
  }
};

// @desc    Get all companion profiles with filters
// @route   GET /api/admin/companions
// @access  Private (Admin role)
const getAllCompanionProfiles = async (req, res, next) => {
  try {
    // Ensure user is admin
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    const { status, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    // Filter by status
    if (status === 'pending') {
      whereClause.isApproved = false;
      whereClause.rejectionReason = null;
      whereClause.profileCompleteness = { [Op.gte]: 70 };
    } else if (status === 'approved') {
      whereClause.isApproved = true;
    } else if (status === 'rejected') {
      whereClause.isApproved = false;
      whereClause.rejectionReason = { [Op.not]: null };
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { displayName: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { locationCity: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await CompanionProfile.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "emailVerified", "createdAt"]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      distinct: true
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      profiles: rows
    });
  } catch (error) {
    console.error("Error fetching companion profiles:", error);
    next(error);
  }
};

// @desc    Get companion profile details for admin review
// @route   GET /api/admin/companions/:id
// @access  Private (Admin role)
const getCompanionProfileForReview = async (req, res, next) => {
  try {
    // Ensure user is admin
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    const profile = await CompanionProfile.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone", "emailVerified", "createdAt"]
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({ message: "Companion profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching companion profile for review:", error);
    next(error);
  }
};

// @desc    Approve or reject a companion profile
// @route   PUT /api/admin/companions/:id/approval
// @access  Private (Admin role)
const approveRejectProfile = async (req, res, next) => {
  const { approved, rejectionReason } = req.body;
  
  try {
    // Ensure user is admin
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    
    const profile = await CompanionProfile.findByPk(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: "Companion profile not found" });
    }
    
    if (approved) {
      profile.isApproved = true;
      profile.approvedAt = new Date();
      profile.approvedBy = req.user.id;
      profile.rejectionReason = null;
    } else {
      profile.isApproved = false;
      profile.approvedAt = null;
      profile.approvedBy = null;
      profile.rejectionReason = rejectionReason || "Profile rejected by admin.";
      profile.isVisible = false;
    }
    
    await profile.save();
    
    res.json({
      message: approved ? "Profile approved successfully." : "Profile rejected.",
      profile: {
        id: profile.id,
        isApproved: profile.isApproved,
        approvedAt: profile.approvedAt,
        rejectionReason: profile.rejectionReason,
        isVisible: profile.isVisible
      }
    });
  } catch (error) {
    console.error("Error approving/rejecting profile:", error);
    next(error);
  }
};

// @desc    Update companion profile (admin edit)
// @route   PUT /api/admin/companions/:id
// @access  Private (Admin role)
const updateCompanionProfile = async (req, res, next) => {
  try {
    // Ensure user is admin
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    const profile = await CompanionProfile.findByPk(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: "Companion profile not found" });
    }

    // Update allowed fields
    const allowedFields = [
      'displayName', 'locationCity', 'locationState', 'locationCountry',
      'aboutMe', 'servicesSummary', 'ratesSummary', 'contactPhone', 
      'contactEmail', 'availabilityStatus'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    res.json({
      message: "Profile updated successfully by admin.",
      profile
    });
  } catch (error) {
    console.error("Error updating companion profile:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: error.errors.map(e => e.message) 
      });
    }
    next(error);
  }
};

// @desc    Delete companion profile
// @route   DELETE /api/admin/companions/:id
// @access  Private (Admin role)
const deleteCompanionProfile = async (req, res, next) => {
  try {
    // Ensure user is admin
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    const profile = await CompanionProfile.findByPk(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: "Companion profile not found" });
    }

    await profile.destroy();

    res.json({
      message: "Profile deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting companion profile:", error);
    next(error);
  }
};

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private (Admin role)
const getAllUsers = async (req, res, next) => {
  try {
    // Ensure user is admin
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    const { userType, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    // Filter by user type
    if (userType && ['Client', 'Companion', 'Admin'].includes(userType)) {
      whereClause.userType = userType;
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: CompanionProfile,
          as: "companionProfile",
          attributes: ["id", "displayName", "isApproved", "isVisible", "profileCompleteness"],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      distinct: true
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users: rows
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllCompanionProfiles,
  getCompanionProfileForReview,
  approveRejectProfile,
  updateCompanionProfile,
  deleteCompanionProfile,
  getAllUsers
};

