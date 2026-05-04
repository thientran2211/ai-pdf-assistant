import express from 'express';
import { optionalAuth } from '../middleware/optionalAuth.js';
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument
} from '../controllers/documentController.js';
import protect from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// All routes are protected
// router.use(protect);

router.post('/upload', optionalAuth, upload.single('file'), uploadDocument);
router.get('/', optionalAuth, getDocuments);
router.get('/:id', optionalAuth, getDocument);

router.delete('/:id', deleteDocument);

export default router;