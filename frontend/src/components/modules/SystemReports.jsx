import { useState, useEffect } from 'react';
import api from '../../services/api';

const SystemReports = () => {
  const [reportType, setReportType] = useState('master-books');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    setData([]); // Clear old data while loading
    try {
      const res = await api.get(`/reports/${reportType}`);
      setData(res.data);
    } catch (err) {
      setError('Failed to load report data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data whenever the selected dropdown option changes
  useEffect(() => {
    fetchReport();
  }, [reportType]);

  // Helper function to dynamically generate table headers based on the data keys
  const getHeaders = () => {
    if (data.length === 0) return [];
    // Filter out internal DB fields like 'id' or 'password_hash' so they don't show on the UI
    return Object.keys(data[0]).filter(key => key !== 'id'); 
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      
      {/* Header and Dropdown Controls */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1e293b] flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Reports</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View master lists, active transactions, and pending dues.</p>
        </div>
        
        <select 
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white font-medium shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="master-books">Master List of Books</option>
          <option value="master-movies">Master List of Movies</option>
          <option value="master-members">Master List of Members</option>
          <option value="active-issues">Active Issues</option>
          <option value="overdue">Overdue Returns & Fines</option>
        </select>
      </div>

      {/* Dynamic Data Table */}
      <div className="p-0 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 animate-pulse">
            Loading report data...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No records found for this report category.
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-700">
              <tr>
                {getHeaders().map((header) => (
                  <th key={header} className="px-6 py-4 font-semibold tracking-wide">
                    {/* Format keys like 'book_name' to 'book name' for cleaner reading */}
                    {header.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {getHeaders().map((header) => (
                    <td key={header} className="px-6 py-4">
                      {/* Format boolean values to Yes/No, and render other data normally */}
                      {typeof row[header] === 'boolean' 
                        ? (row[header] ? 'Yes' : 'No') 
                        : row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SystemReports;