import express from 'express';
import { chatWithDocs } from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', chatWithDocs);

export default router;
