import { useState } from 'react';
import api from '../../services/api';

const ReturnBook = () => {
  const [formData, setFormData] = useState({
    serial_no: '',
    actual_return_date: new Date().toISOString().split('T')[0],
    remarks: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [fineInfo, setFineInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Processing return...' });
    setFineInfo(null);
    
    try {
      const res = await api.post('/transactions/return', formData);
      setStatus({ type: 'success', message: 'Item returned successfully!' });
      
      if (res.data.fine_calculated > 0) {
        setFineInfo(`A fine of ₹${res.data.fine_calculated} has been added to the member's account.`);
      }
      
      setFormData({ ...formData, serial_no: '', remarks: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.detail || 'Return failed. Please check the serial number.' });
    }
  };

  return (
    <div className="max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Return Book / Movie</h2>
      
      {status.message && (
        <div className={`p-3 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.message}
        </div>
      )}
      
      {fineInfo && (
        <div className="p-3 mb-4 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
          ⚠️ {fineInfo}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Serial Number *</label>
            <input type="text" value={formData.serial_no} onChange={(e) => setFormData({...formData, serial_no: e.target.value})} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Actual Return Date *</label>
            <input type="date" value={formData.actual_return_date} onChange={(e) => setFormData({...formData, actual_return_date: e.target.value})} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Remarks (Optional)</label>
          <textarea value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows="2"></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm Return</button>
        </div>
      </form>
    </div>
  );
};

export default ReturnBook;