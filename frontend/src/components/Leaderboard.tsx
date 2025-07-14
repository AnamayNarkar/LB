import type { FC } from 'react';
import type { User } from '../types';

interface LeaderboardProps {
  users: User[];
}

const Leaderboard: FC<LeaderboardProps> = ({ users }) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400'; // Gold
      case 2:
        return 'text-gray-300'; // Silver
      case 3:
        return 'text-amber-600'; // Bronze
      default:
        return 'text-gray-400';
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white">🏆 Leaderboard</h2>
      
      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No users found. Add some users to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className={`p-4 rounded-lg border transition-all ${
                user.rank <= 3
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-500'
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${getRankColor(user.rank)}`}>
                    {getRankEmoji(user.rank)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Rank #{user.rank}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {user.totalPoints}
                  </div>
                  <div className="text-sm text-gray-400">
                    points
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
