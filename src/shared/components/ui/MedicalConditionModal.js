import React, { useState } from 'react';
import GlassModal from './GlassModal';
import { ARTIST_OVERRIDE_CODE } from '../../../shared/constants/formConstants';

const MedicalConditionModal = ({ open, onClose, onCodeVerified }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Verify the code
    if (code === ARTIST_OVERRIDE_CODE) {
      setLoading(false);
      setCode('');
      onCodeVerified();
    } else {
      setLoading(false);
      setError('Invalid code. Please try again.');
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setCode(value);
      setError('');
    }
  };

  return (
    <GlassModal open={open} onClose={onClose}>
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Medical Condition Detected</h2>
        <p className="text-gray-300 mb-6">
          You have selected a medical condition. Please consult with the artist before proceeding.
          Only an artist can submit this form by entering the 6-digit verification code.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter 6-Digit Artist Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={code.length !== 6 || loading}
              className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlassModal>
  );
};

export default MedicalConditionModal;

