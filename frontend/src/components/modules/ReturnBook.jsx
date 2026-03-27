import { useState } from 'react';
import api from '../../services/api';

const ReturnBook = ({ onNavigateToFine }) => {
  const [serialNo, setSerialNo] = useState('');
  const [fetchedData, setFetchedData] = useState(null);
  const [actualReturnDate, setActualReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  
  const [status, setStatus] = useState({ type: '', message: '' });

  // 1. Fetch details to auto-populate the form
  const handleFetchDetails = async () => {
    setStatus({ type: 'loading', message: 'Fetching details...' });
    try {
      const res = await api.get(`/transactions/active/${serialNo}`);
      setFetchedData(res.data);
      setStatus({ type: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.detail || 'Could not find active issue for this serial number.' });
      setFetchedData(null);
    }
  };

  // 2. Submit the actual return
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fetchedData) return;

    setStatus({ type: 'loading', message: 'Processing return...' });
    
    try {
      await api.post('/transactions/return', {
        serial_no: serialNo,
        actual_return_date: actualReturnDate,
        remarks: remarks
      });
      
      // Requirement: Redirect to Pay Fine page irrespective of fine amount
      // We pass the membership_id so the Fine page can auto-populate it
      onNavigateToFine(fetchedData.membership_id);
      
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.detail || 'Return failed.' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Return Book / Movie</h2>
      
      {status.message && (
        <div className={`p-3 mb-4 rounded ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {status.message}
        </div>
      )}

      {/* Step 1: Enter Serial No */}
      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Serial Number *</label>
          <input 
            type="text" 
            value={serialNo} 
            onChange={(e) => setSerialNo(e.target.value)} 
            placeholder="Enter Serial No to fetch details..."
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" 
          />
        </div>
        <div className="flex items-end">
          <button onClick={handleFetchDetails} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded transition font-medium">
            Fetch Details
          </button>
        </div>
      </div>

      {/* Step 2: Auto-Populated Form */}
      {fetchedData && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-500">Book Name</label>
              <input type="text" value={fetchedData.book_name} readOnly className="w-full p-2 bg-gray-100 dark:bg-gray-700 border rounded cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-500">Author Name</label>
              <input type="text" value={fetchedData.author_name} readOnly className="w-full p-2 bg-gray-100 dark:bg-gray-700 border rounded cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-500">Issue Date</label>
              <input type="text" value={fetchedData.issue_date} readOnly className="w-full p-2 bg-gray-100 dark:bg-gray-700 border rounded cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Actual Return Date *</label>
              <input 
                type="date" 
                value={actualReturnDate} 
                onChange={(e) => setActualReturnDate(e.target.value)} 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Remarks (Optional)</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows="2"></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium">
            Confirm Return & Proceed to Fine Payment
          </button>
        </form>
      )}
    </div>
  );
};

export default ReturnBook;