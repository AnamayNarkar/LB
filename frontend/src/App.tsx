import { useState, useEffect } from 'react';
import type { User } from './types';
import apiService from './services/api';
import socketService from './services/socket';
import UserSelection from './components/UserSelection';
import Leaderboard from './components/Leaderboard';
import AddUserModal from './components/AddUserModal';
import './App.css';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAward, setLastAward] = useState<{ points: number; user: string } | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    
    // Connect to WebSocket
    socketService.connect();
    
    // Listen for real-time updates
    socketService.onLeaderboardUpdate((updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getUsers();
      setUsers(usersData);
      if (usersData.length > 0 && !selectedUser) {
        setSelectedUser(usersData[0]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const result = await apiService.claimPoints(selectedUser._id);
      setLastAward({
        points: result.pointsAwarded,
        user: selectedUser.name
      });
      setUsers(result.leaderboard);
      
      // Clear the award message after 3 seconds
      setTimeout(() => setLastAward(null), 3000);
    } catch (error) {
      console.error('Error claiming points:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (name: string) => {
    try {
      await apiService.createUser(name);
      await fetchUsers(); // Refresh the user list
      setShowAddUserModal(false);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Glass Effect */}
        <div className="text-center mb-12 p-8 backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            🏆 Game Leaderboard
          </h1>
          <p className="text-lg text-blue-200">
            Compete, climb the ranks, and claim your spot at the top!
          </p>
        </div>

        {/* Last Award Notification */}
        {lastAward && (
          <div className="fixed top-4 right-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg transform transition-all duration-500 ease-out animate-slide-in z-50">
            <p className="text-lg font-semibold flex items-center">
              <span className="text-2xl mr-2">🎉</span>
              {lastAward.user} earned {lastAward.points} points!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - User Selection and Actions */}
          <div className="space-y-6">
            <UserSelection
              users={users}
              selectedUser={selectedUser}
              onUserSelect={setSelectedUser}
              onClaimPoints={handleClaimPoints}
              loading={loading}
            />

            {/* Action Button */}
            <button
              onClick={() => setShowAddUserModal(true)}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <span className="text-2xl mr-2">➕</span>
              Add New Player
            </button>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-75 blur"></div>
            <div className="relative">
              <Leaderboard users={users} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
}

export default App;
