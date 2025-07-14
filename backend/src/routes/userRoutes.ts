import express from 'express';
import { createUser, getUsers, claimPoints } from '../controllers/userController';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', getUsers);

// POST /api/users - Create a new user
router.post('/', createUser);

// POST /api/users/claim - Claim points for a user
router.post('/claim', claimPoints);

export default router;
