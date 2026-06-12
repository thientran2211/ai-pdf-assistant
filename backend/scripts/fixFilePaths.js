import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Document from '../models/Document.js';

dotenv.config();

const fixFilePaths = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all documents with localhost URLs
    const docs = await Document.find({
      filePath: { $regex: /^http:\/\/localhost/ }
    });

    console.log(`📄 Found ${docs.length} documents with localhost URLs`);

    for (const doc of docs) {
      const oldPath = doc.filePath;
      // Extract just the path part: /uploads/documents/filename.pdf
      const urlObj = new URL(oldPath);
      const newPath = urlObj.pathname;
      
      doc.filePath = newPath;
      await doc.save();
      
      console.log(`✅ Updated: ${doc.title}`);
      console.log(`   Old: ${oldPath}`);
      console.log(`   New: ${newPath}`);
    }

    console.log('\n🎉 Done! All documents updated.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixFilePaths();