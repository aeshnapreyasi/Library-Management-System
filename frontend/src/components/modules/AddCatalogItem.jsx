import { useState } from 'react';
import api from '../../services/api';

const AddCatalogItem = () => {
  // Default to 'book' as per requirements
  const [formData, setFormData] = useState({
    item_type: 'book', 
    serial_no: '',
    name: '',
    author: '',
    category: '',
    cost: '',
    procurement_date: new Date().toISOString().split('T')[0]
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Adding item...' });
    
    try {
      await api.post('/maintenance/catalog', formData);
      setStatus({ type: 'success', message: 'Item added successfully!' });
      // Reset form, keeping the default type as 'book'
      setFormData({ ...formData, serial_no: '', name: '', author: '', category: '', cost: '' });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.detail || 'Failed to add item. Ensure all fields are filled.' 
      });
    }
  };

  return (
    <div className="max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Add New Book / Movie</h2>
      
      {status.message && (
        <div className={`p-3 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : status.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Radio Buttons for Item Type */}
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input type="radio" name="item_type" value="book" checked={formData.item_type === 'book'} onChange={handleChange} className="text-blue-600" />
            <span>Book</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="item_type" value="movie" checked={formData.item_type === 'movie'} onChange={handleChange} className="text-blue-600" />
            <span>Movie</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Serial Number *</label>
            <input type="text" name="serial_no" value={formData.serial_no} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author / Director *</label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
              <option value="">Select Category</option>
              <option value="Science">Science</option>
              <option value="Fiction">Fiction</option>
              <option value="Economics">Economics</option>
              <option value="Children">Children</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Procurement Date *</label>
            <input type="date" name="procurement_date" value={formData.procurement_date} onChange={handleChange} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cost</label>
            <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={() => setFormData({...formData, name: '', serial_no: ''})} className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm</button>
        </div>
      </form>
    </div>
  );
};

export default AddCatalogItem;