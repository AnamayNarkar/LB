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
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white">Select User</h2>
      
      {/* User Selection Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Choose a user to claim points:
        </label>
        <select
          value={selectedUser?._id || ''}
          onChange={(e) => {
            const user = users.find(u => u._id === e.target.value);
            if (user) onUserSelect(user);
          }}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a user...</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} - {user.totalPoints} points (Rank #{user.rank})
            </option>
          ))}
        </select>
      </div>

      {/* Selected User Info */}
      {selectedUser && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">
            Selected: {selectedUser.name}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Current Points:</span>
              <span className="ml-2 text-white font-semibold">
                {selectedUser.totalPoints}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Current Rank:</span>
              <span className="ml-2 text-white font-semibold">
                #{selectedUser.rank}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Claim Points Button */}
      <button
        onClick={onClaimPoints}
        disabled={!selectedUser || loading}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
          !selectedUser || loading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transform hover:scale-105'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
            Claiming Points...
          </div>
        ) : (
          '🎲 Claim Random Points (1-10)'
        )}
      </button>
    </div>
  );
};

export default UserSelection;
