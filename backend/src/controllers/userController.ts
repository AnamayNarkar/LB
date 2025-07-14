import { Request, Response } from 'express';
import { User, PointHistory } from '../models';
import { calculateRankings, generateRandomPoints } from '../utils/helpers';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const existingUser = await User.findOne({ name: name.trim() });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const user = new User({ name: name.trim() });
    await user.save();
    
    await calculateRankings();
    
    // Emit socket event for real-time updates
    try {
      const users = await User.find().sort({ totalPoints: -1 });
      if (global.io) {
        global.io.emit('leaderboard-update', users);
      }
    } catch (error) {
      console.error('Error emitting leaderboard update:', error);
    }
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const claimPoints = async (req: Request, res: Response): Promise<void> => {
  try {
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

    // Create point history
    const pointHistory = new PointHistory({
      userId: user._id,
      userName: user.name,
      pointsAwarded,
      totalPointsAfter: user.totalPoints
    });
    await pointHistory.save();

    // Recalculate rankings
    await calculateRankings();

    // Get updated user list
    const updatedUsers = await User.find().sort({ totalPoints: -1 });

    // Emit socket event for real-time updates
    try {
      const users = await User.find().sort({ totalPoints: -1 });
      if (global.io) {
        global.io.emit('leaderboard-update', users);
      }
    } catch (error) {
      console.error('Error emitting leaderboard update:', error);
    }

    res.json({
      pointsAwarded,
      user: await User.findById(userId),
      leaderboard: updatedUsers
    });
  } catch (error) {
    console.error('Error claiming points:', error);
    res.status(500).json({ error: 'Failed to claim points' });
  }
};

export const getPointHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    let history;
    if (userId) {
      history = await PointHistory.find({ userId }).sort({ claimedAt: -1 });
    } else {
      history = await PointHistory.find().sort({ claimedAt: -1 });
    }
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching point history:', error);
    res.status(500).json({ error: 'Failed to fetch point history' });
  }
};
