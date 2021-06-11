import { Router } from 'express';
import { body } from 'express-validator';

import adminAuthMiddleware from '../middleware/adminAuthMiddleware';

import KeyController from '../controller/key/KeyController';

const router = Router();

// Create route
router.post(
  '/create',
  body('content').isLength({ min: 32, max: 32 }),
  adminAuthMiddleware,
  KeyController.store,
);

// Create random key route
router.post('/createRandom', adminAuthMiddleware, KeyController.storeRandom);

// Read all route
router.get('/listAll', adminAuthMiddleware, KeyController.indexAll);

// Read one route
router.get('/listOne', adminAuthMiddleware, KeyController.indexOne);

// Delete route
router.delete('/delete', adminAuthMiddleware, KeyController.delete);

// Redeem route
router.post(
  '/redeem',
  body('content').isLength({ min: 32, max: 32 }).exists(),
  body(['minecraftUsername', 'password']).exists(),
  KeyController.redeem,
);

export default router;
