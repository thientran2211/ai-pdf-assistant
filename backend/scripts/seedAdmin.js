import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminData = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123456',
      role: 'admin',
      isBlocked: false,
      apiQuota: {
        dailyLimit: 999,
        usedToday: 0,
        lastReset: new Date()
      }
    };

    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.apiQuota = adminData.apiQuota;
      await existingAdmin.save();
    } else {
      const admin = await User.create(adminData);
      console.log('✅ Admin created successfully');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Password:', adminData.password);
    }

    const admins = await User.find({ role: 'admin' }).select('username email role');
    console.log('\nCurrent admins:');
    admins.forEach(a => console.log(`  - ${a.username} (${a.email})`));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();