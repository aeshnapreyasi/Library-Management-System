import { useState } from 'react';
import api from '../../services/api';

const IssueBook = () => {
  const [formData, setFormData] = useState({
    serial_no: '',
    membership_id: '',
    remarks: ''
  });
  
  // Calculate default dates for display (Issue = Today, Return = Today + 15 days) 
  const today = new Date();
  const returnDate = new Date(today);
  returnDate.setDate(today.getDate() + 15);

  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Processing transaction...' });
    
    try {
      const res = await api.post('/transactions/issue', formData);
      setStatus({ type: 'success', message: `Success! Expected return date: ${res.data.expected_return_date}` });
      setFormData({ serial_no: '', membership_id: '', remarks: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.detail || 'Transaction failed.' });
    }
  };

  return (
    <div className="max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Issue Book / Movie</h2>
      
      {status.message && (
        <div className={`p-3 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Serial No *</label>
            <input type="text" placeholder="e.g., SC(B)000001" value={formData.serial_no} onChange={(e) => setFormData({...formData, serial_no: e.target.value})} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Membership ID *</label>
            <input type="text" placeholder="e.g., M-001" value={formData.membership_id} onChange={(e) => setFormData({...formData, membership_id: e.target.value})} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          
          {/* Read-only date displays to show system rules */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">Issue Date (Auto)</label>
            <input type="text" value={today.toISOString().split('T')[0]} disabled className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-600 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">Return Date (Auto +15 Days)</label>
            <input type="text" value={returnDate.toISOString().split('T')[0]} disabled className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-600 text-gray-500 cursor-not-allowed" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Remarks (Optional)</label>
          <textarea value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows="2"></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm Issue</button>
        </div>
      </form>
    </div>
  );
};

export default IssueBook;