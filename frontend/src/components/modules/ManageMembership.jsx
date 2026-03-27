import { useState } from 'react';
import api from '../../services/api';

const ManageMembership = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact_number: '',
    contact_address: '',
    aadhar_card_no: '',
    membership_type: '6_months' // Default as per requirements
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Adding member...' });
    
    try {
      await api.post('/maintenance/memberships', formData);
      setStatus({ type: 'success', message: 'Membership created successfully!' });
      setFormData({
        first_name: '', last_name: '', contact_number: '', contact_address: '', aadhar_card_no: '', membership_type: '6_months'
      });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.detail || 'Failed to create membership.' });
    }
  };

  return (
    <div className="max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Add New Membership</h2>
      
      {status.message && (
        <div className={`p-3 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Number *</label>
            <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Aadhar Card No *</label>
            <input type="text" name="aadhar_card_no" value={formData.aadhar_card_no} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Address *</label>
          <textarea name="contact_address" value={formData.contact_address} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows="2"></textarea>
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium mb-2">Membership Duration *</label>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input type="radio" name="membership_type" value="6_months" checked={formData.membership_type === '6_months'} onChange={handleChange} className="text-blue-600" />
              <span>6 Months</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="membership_type" value="1_year" checked={formData.membership_type === '1_year'} onChange={handleChange} className="text-blue-600" />
              <span>1 Year</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="membership_type" value="2_years" checked={formData.membership_type === '2_years'} onChange={handleChange} className="text-blue-600" />
              <span>2 Years</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm Membership</button>
        </div>
      </form>
    </div>
  );
};

export default ManageMembership;