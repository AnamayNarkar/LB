import express from 'express';
import { getAllUsers, createUser, claimPoints, getPointHistory } from '../controllers/userController';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', getAllUsers);

// POST /api/users - Create a new user
router.post('/', createUser);

// POST /api/users/claim - Claim points for a user
router.post('/claim', claimPoints);

// GET /api/users/history/:userId? - Get point history (all or for specific user)
router.get('/history/:userId?', getPointHistory);

export default router;
