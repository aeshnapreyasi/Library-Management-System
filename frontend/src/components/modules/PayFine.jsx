import { useState } from 'react';
import api from '../../services/api';

const PayFine = () => {
  const [membershipId, setMembershipId] = useState('');
  const [finePaid, setFinePaid] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!finePaid) {
      setStatus({ type: 'error', message: 'You must check "Fine Paid" to confirm the transaction.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Processing payment...' });
    try {
      // Assuming a backend route that clears the member's pending_fine
      await api.post('/transactions/fine', { membership_id: membershipId });
      setStatus({ type: 'success', message: 'Fine cleared successfully.' });
      setMembershipId('');
      setFinePaid(false);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.detail || 'Payment failed.' });
    }
  };

  return (
    <div className="max-w-xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Pay Fine</h2>

      {status.message && (
        <div className={`p-3 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Membership ID *</label>
          <input type="text" value={membershipId} onChange={(e) => setMembershipId(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <input 
            type="checkbox" 
            id="finePaid" 
            checked={finePaid} 
            onChange={(e) => setFinePaid(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="finePaid" className="text-sm font-medium text-gray-900 dark:text-gray-300">
            Confirm Fine Amount Received
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Process Payment</button>
        </div>
      </form>
    </div>
  );
};

export default PayFine;