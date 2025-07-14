import type { FC } from 'react';
import type { PointHistory } from '../types';

interface PointHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PointHistory[];
}

const PointHistoryModal: FC<PointHistoryModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 border border-gray-700 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">📊 Point History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No point history found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry._id}
                  className="p-4 bg-gray-700 rounded-lg border border-gray-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">
                        {entry.userName}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {formatDate(entry.claimedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">
                        +{entry.pointsAwarded} points
                      </div>
                      <div className="text-sm text-gray-400">
                        Total: {entry.totalPointsAfter}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointHistoryModal;
