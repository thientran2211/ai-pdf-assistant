import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  profileImage: {
    type: String,
    default: null
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  apiQuota: {
    dailyLimit: { type: Number, default: 50 },
    usedToday: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.checkQuota = function () {
  const now = new Date();
  const lastReset = new Date(this.apiQuota.lastReset);
  
  // Reset quota if new day
  if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth()) {
    this.apiQuota.usedToday = 0;
    this.apiQuota.lastReset = now;
  }
  
  return this.apiQuota.usedToday < this.apiQuota.dailyLimit;
};

userSchema.methods.incrementQuota = function () {
  this.apiQuota.usedToday += 1;
  return this.save();
};

const User = mongoose.model('User', userSchema);
export default User;