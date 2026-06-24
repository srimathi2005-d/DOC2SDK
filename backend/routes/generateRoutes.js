import express from 'express';
import { generateSDK } from '../controllers/generateController.js';

const router = express.Router();

router.post('/generate', generateSDK);

export default router;
