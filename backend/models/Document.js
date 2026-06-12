import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  guestSessionId: {
    type: String,
    default: null
  },

  expiresAt: {
    type: Date,
    default: function() {
      return this.userId ? null: new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  },
  title: {
    type: String,
    required: [true, 'Please provide a document title'],
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  extractedText: {
    type: String,
    default: ''
  },
  numPages: {
    type: Number,
    default: 0
  },
  chunks: [{
    content: {
      type: String,
      required: true
    },
    pageNumber: {
      type: Number,
      default: 0
    },
    chunkIndex: {
      type: Number,
      required: true
    }
  }],
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing'
  }
}, {
  timestamps: true,
  expireAfterSeconds: 86400
});

// Index for faster queries
documentSchema.index({ userId: 1, uploadDate: -1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;