import { Router } from 'express';
import { body } from 'express-validator';

import authMiddleware from '../middleware/authMiddleware';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware';

import AuthController from '../controller/auth/AuthController';
import UserController from '../controller/user/UserController';

const router = Router();

// Register an user
router.post(
  '/create',
  body('password').isLength({ min: 8, max: 16 }).exists(),
  body('minecraftUsername').exists(),
  UserController.store,
);

// Index an user
router.get(
  '/listOne',
  body('minecraftUsername').exists(),
  adminAuthMiddleware,
  UserController.indexOne,
);

// Index all users
router.get('/listAll', adminAuthMiddleware, UserController.indexAll);

// Delete an user
router.delete(
  '/delete',
  body('minecraftUsername').exists(),
  adminAuthMiddleware,
  UserController.delete,
);

// Authenticate an user
router.post(
  '/authenticate',
  body(['minecraftUsername', 'password']).exists(),
  AuthController.authenticate,
);

// Update logged in user (must be an logged normal user)
router.patch(
  '/update/me',
  body(['minecraftUsername', 'hardwareId']).exists(),
  authMiddleware,
  UserController.update,
);

// Update an user (must be admin)
router.patch(
  '/update',
  body(['target', 'newData']).exists(),
  adminAuthMiddleware,
  UserController.adminUpdate,
);

// Ban an user (must be admin)
router.post(
  '/ban',
  body('minecraftUsername').exists(),
  adminAuthMiddleware,
  UserController.ban,
);

export default router;
