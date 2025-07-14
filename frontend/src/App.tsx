import { useState, useEffect } from 'react';
import type { User, PointHistory } from './types';
import apiService from './services/api';
import socketService from './services/socket';
import UserSelection from './components/UserSelection';
import Leaderboard from './components/Leaderboard';
import AddUserModal from './components/AddUserModal';
import PointHistoryModal from './components/PointHistoryModal';
import './App.css';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAward, setLastAward] = useState<{ points: number; user: string } | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);

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
      const newUser = await apiService.createUser(name);
      await fetchUsers(); // Refresh the user list
      setShowAddUserModal(false);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const handleShowHistory = async () => {
    try {
      const history = await apiService.getPointHistory();
      setPointHistory(history);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Error fetching point history:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-400">
            Select a user and claim random points to climb the rankings!
          </p>
        </div>

        {/* Last Award Notification */}
        {lastAward && (
          <div className="mb-6 p-4 bg-green-600 rounded-lg text-center animate-pulse">
            <p className="text-lg font-semibold">
              🎉 {lastAward.user} earned {lastAward.points} points!
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ➕ Add New User
              </button>
              <button
                onClick={handleShowHistory}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                📊 View History
              </button>
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <Leaderboard users={users} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAddUser={handleAddUser}
      />

      <PointHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={pointHistory}
      />
    </div>
  );
}

export default App;
