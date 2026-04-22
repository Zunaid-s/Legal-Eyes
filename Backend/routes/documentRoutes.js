import express from 'express';
import { getUserDocuments, getDocumentAnalysis, deleteDocument } from '../controllers/documentController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/history', verifyToken, getUserDocuments);
router.get('/:id/analysis', verifyToken, getDocumentAnalysis);
router.delete('/delDoc/:id', verifyToken, deleteDocument);

export default router;