import type { FC } from 'react';
import type { User } from '../types';

interface LeaderboardProps {
  users: User[];
}

const Leaderboard: FC<LeaderboardProps> = ({ users }) => {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          textColor: 'text-gray-900',
          badge: '👑'
        };
      case 2:
        return {
          background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8)',
          textColor: 'text-gray-900',
          badge: '🥈'
        };
      case 3:
        return {
          background: 'linear-gradient(135deg, #CD7F32, #DEB887)',
          textColor: 'text-gray-900',
          badge: '🥉'
        };
      default:
        return {
          background: 'bg-gray-800/50',
          textColor: 'text-white',
          badge: '🏅'
        };
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Live Rankings
      </h2>
      
      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No players yet. Be the first to join!</p>
          <p className="text-sm mt-2">Click "Add New Player" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const style = getRankStyle(user.rank);
            return (
              <div
                key={user._id}
                className={`relative p-4 rounded-xl transition-all duration-300 transform hover:scale-102 hover:shadow-xl ${style.background}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">
                      {style.badge}
                    </div>
                    <div>
                      <h3 className={`font-bold text-xl ${style.textColor}`}>
                        {user.name}
                      </h3>
                      <p className={`text-sm opacity-75 ${style.textColor}`}>
                        Rank #{user.rank}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${style.textColor}`}>
                      {user.totalPoints}
                    </div>
                    <div className={`text-sm opacity-75 ${style.textColor}`}>
                      points
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
