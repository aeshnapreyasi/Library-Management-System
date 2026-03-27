import { useState, useEffect } from 'react';
import api from '../../services/api';

const IssueBook = ({ selectedBookData, onBack }) => {
  // Initialize state with all required fields
  const [formData, setFormData] = useState({
    serial_no: selectedBookData?.serial_no || '',
    membership_id: '', // Crucial for backend!
    book_name: selectedBookData?.name || '',
    author_name: selectedBookData?.author || '',
    issue_date: new Date().toISOString().split('T')[0],
    return_date: '',
    remarks: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Requirement: Return Date automatically populated 15 days ahead
    const date = new Date();
    date.setDate(date.getDate() + 15);
    setFormData(prev => ({ ...prev, return_date: date.toISOString().split('T')[0] }));
  }, []);

  const handleDateChange = (e) => {
    const selectedReturn = new Date(e.target.value);
    const issueDate = new Date(formData.issue_date);
    const maxReturn = new Date(issueDate);
    maxReturn.setDate(issueDate.getDate() + 15);

    // Requirement: Can be edited to a date earlier, but not greater than 15 days
    if (selectedReturn > maxReturn) {
      setError('Return date cannot be more than 15 days from the issue date.');
    } else {
      setError('');
      setFormData({ ...formData, return_date: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;
    
    setError('');
    setSuccess('');

    try {
      await api.post('/transactions/issue', {
        serial_no: formData.serial_no,
        membership_id: formData.membership_id,
        issue_date: formData.issue_date,
        return_date: formData.return_date,
        remarks: formData.remarks
      });
      setSuccess('Book issued successfully!');
      // Clear ID and remarks on success so they can issue another book if needed
      setFormData(prev => ({...prev, membership_id: '', remarks: ''}));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to issue book.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Issue Book</h2>
        {/* Only show back button if we navigated here from the Search component */}
        {onBack && (
          <button onClick={onBack} className="text-sm text-blue-600 hover:underline">
            ← Back to Search
          </button>
        )}
      </div>
      
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded border border-red-200 text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded border border-green-200 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Book Details (Auto-populated & Read Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">Item Serial No</label>
            <input type="text" value={formData.serial_no} readOnly className="w-full p-2 bg-gray-100 dark:bg-gray-700 border rounded cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">Book Name</label>
            <input type="text" value={formData.book_name} readOnly className="w-full p-2 bg-gray-100 dark:bg-gray-700 border rounded cursor-not-allowed" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-500">Author Name (Non-Editable)</label>
            <input type="text" value={formData.author_name} readOnly className="w-full p-2 bg-gray-100 dark:bg-gray-700 border rounded cursor-not-allowed" />
          </div>
        </div>

        {/* User Input Fields */}
        <div className="border-t pt-4 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Membership ID *</label>
            <input 
              type="text" 
              placeholder="e.g. M-001"
              value={formData.membership_id}
              onChange={(e) => setFormData({...formData, membership_id: e.target.value})}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Issue Date *</label>
            <input 
              type="date" 
              min={new Date().toISOString().split('T')[0]} // Cannot be less than today
              value={formData.issue_date}
              onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Return Date *</label>
            <input 
              type="date" 
              value={formData.return_date}
              onChange={handleDateChange} // Enforces the +15 day maximum rule
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" 
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Remarks (Optional)</label>
          <textarea 
            value={formData.remarks}
            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            placeholder="Remarks..."
          />
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium">
          Confirm Issue
        </button>
      </form>
    </div>
  );
};

export default IssueBook;