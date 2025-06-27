// backend/routes/emmployeeRoutes.js
import express from 'express';
import { getEmmployees, createEmmployee } from '../controllers/emmployeeController.js';

const router = express.Router();

router.get('/',  getEmmployees);
router.post('/', createEmmployee);

export default router;
