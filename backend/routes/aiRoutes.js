import express from 'express';
import protect from '../middleware/auth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory
} from '../controllers/aiController.js';

const router = express.Router();

// router.use(protect);
router.post('/generate-flashcards', protect, generateFlashcards);
router.post('/generate-quiz', protect, generateQuiz);

router.post('/generate-summary', optionalAuth, generateSummary);
router.post('/chat', optionalAuth, chat);
router.post('/explain-concept', optionalAuth, explainConcept);
router.get('/chat-history/:documentId', optionalAuth, getChatHistory);

export default router;