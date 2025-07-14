import { User } from '../models';

export const calculateRankings = async (): Promise<void> => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    
    for (let i = 0; i < users.length; i++) {
      users[i].rank = i + 1;
      await users[i].save();
    }
  } catch (error) {
    console.error('Error calculating rankings:', error);
  }
};

export const generateRandomPoints = (): number => {
  return Math.floor(Math.random() * 10) + 1;
};
