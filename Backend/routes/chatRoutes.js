import express from 'express';
import { chatWithDocument } from '../controllers/chatController.js';

const router = express.Router();

router.post('/documents/:id/chat', chatWithDocument);

export default router;