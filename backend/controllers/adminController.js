import User from '../models/User.js';
import Document from '../models/Document.js';

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) { next(error); }
};

// @desc    Update user role/block status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const { role, isBlocked, dailyLimit } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    if (role) user.role = role;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;
    if (dailyLimit) user.apiQuota.dailyLimit = dailyLimit;
    
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

// @desc    Reset user quota
// @route   POST /api/admin/users/:id/reset-quota
// @access  Private/Admin
export const resetUserQuota = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    user.apiQuota.usedToday = 0;
    user.apiQuota.lastReset = new Date();
    await user.save();
    
    res.status(200).json({ success: true, message: 'Quota reset successfully' });
  } catch (error) { next(error); }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDocs = await Document.countDocuments();
    const activeUsers = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7*24*60*60*1000) } });
    
    res.status(200).json({
      success: true,
      data: { totalUsers, totalDocs, activeUsers }
    });
  } catch (error) { next(error); }
};