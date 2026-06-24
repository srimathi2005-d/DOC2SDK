import express from 'express';
import { analyzeDocs } from '../controllers/analyzeController.js';

const router = express.Router();

router.post('/analyze', analyzeDocs);

export default router;
