import { useState } from 'react';
import type { FC } from 'react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (name: string) => Promise<void>;
}

const AddUserModal: FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a player name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onAddUser(name.trim());
      setName('');
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to add player');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 w-full max-w-md mx-auto border border-gray-700/50 shadow-2xl transform transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Add New Player
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-blue-300 mb-3">
              Player Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800/50 backdrop-blur border-2 border-gray-700/50 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              placeholder="Enter player name..."
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700/50 rounded-xl text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 text-lg font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-300 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Player'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
