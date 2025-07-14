import { Request, Response } from 'express';
import { User } from '../models';
import { calculateRankings, generateRandomPoints } from '../utils/helpers';
import { emitLeaderboardUpdate } from '../index';
import connectDB from '../utils/database';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
        connectDB();
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const user = new User({ name });
    await user.save();
    await calculateRankings();

    // Get updated leaderboard
    const users = await User.find().sort({ totalPoints: -1 });
    await emitLeaderboardUpdate();

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
        connectDB();
    const users = await User.find().sort({ totalPoints: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const claimPoints = async (req: Request, res: Response): Promise<void> => {
  try {
        connectDB();
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const pointsAwarded = generateRandomPoints();
    user.totalPoints += pointsAwarded;
    await user.save();
    await calculateRankings();

    // Get updated leaderboard
    const users = await User.find().sort({ totalPoints: -1 });
    await emitLeaderboardUpdate();

    res.json({
      pointsAwarded,
      user,
      leaderboard: users
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
