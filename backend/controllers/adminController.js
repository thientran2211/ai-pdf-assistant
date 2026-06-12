import User from '../models/User.js';
import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';

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

// @desc    Delete user permanently (hard delete)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        statusCode: 404
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete yourself',
        statusCode: 400
      });
    }

    // Prevent deleting other admins (safety measure)
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete admin users. Remove admin role first.',
        statusCode: 403
      });
    }

    const [deletedDocs, deletedFlashcards, deletedQuizzes, deletedChats] = await Promise.all([
      Document.deleteMany({ userId: user._id }),
      Flashcard.deleteMany({ userId: user._id }),
      Quiz.deleteMany({ userId: user._id }),
      ChatHistory.deleteMany({ userId: user._id })
    ]);

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: `User "${user.username}" deleted permanently`,
      data: {
        deletedDocuments: deletedDocs.deletedCount,
        deletedFlashcards: deletedFlashcards.deletedCount,
        deletedQuizzes: deletedQuizzes.deletedCount,
        deletedChatHistories: deletedChats.deletedCount
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  }
};