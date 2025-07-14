import type { FC } from 'react';
import type { User } from '../types';

interface UserSelectionProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  onClaimPoints: () => void;
  loading: boolean;
}

const UserSelection: FC<UserSelectionProps> = ({
  users,
  selectedUser,
  onUserSelect,
  onClaimPoints,
  loading
}) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Claim Points
      </h2>
      
      {/* User Selection Dropdown */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-blue-300 mb-3">
          Select your player:
        </label>
        <div className="relative">
          <select
            value={selectedUser?._id || ''}
            onChange={(e) => {
              const user = users.find(u => u._id === e.target.value);
              if (user) onUserSelect(user);
            }}
            className="w-full bg-gray-700/50 backdrop-blur border-2 border-gray-600/50 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="">Choose a player...</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} - {user.totalPoints} points (Rank #{user.rank})
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            ▼
          </div>
        </div>
      </div>

      {/* Selected User Info */}
      {selectedUser && (
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border border-blue-700/30">
          <h3 className="text-xl font-bold text-blue-300 mb-3">
            Selected Player: {selectedUser.name}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-400">
                {selectedUser.totalPoints}
              </div>
              <div className="text-sm text-gray-400">
                Current Points
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-400">
                #{selectedUser.rank}
              </div>
              <div className="text-sm text-gray-400">
                Current Rank
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Points Button */}
      <button
        onClick={onClaimPoints}
        disabled={!selectedUser || loading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
          !selectedUser || loading
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span>Rolling the dice...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">🎲</span>
            <span>Roll for Points (1-10)</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default UserSelection;
