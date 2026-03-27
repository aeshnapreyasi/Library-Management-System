import { useState, useEffect } from 'react';
import api from '../../services/api';
import { AlertCircle } from 'lucide-react';

const OverdueReturns = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverdue = async () => {
      try {
        const res = await api.get('/reports/overdue');
        setReports(res.data);
      } catch (err) {
        setError('Failed to load overdue reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverdue();
  }, []);

  if (loading) return <div className="p-4">Loading reports...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-xl font-semibold flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="mr-2" size={20} /> Overdue Returns
        </h2>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
          {reports.length} Items Pending
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">Book/Movie Name</th>
              <th className="px-6 py-3">Member ID</th>
              <th className="px-6 py-3">Expected Return</th>
              <th className="px-6 py-3">Days Overdue</th>
              <th className="px-6 py-3">Fine (Calculated)</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No overdue items currently.</td>
              </tr>
            ) : (
              reports.map((txn, index) => (
                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  <td className="px-6 py-4 font-medium">{txn.item_name}</td>
                  <td className="px-6 py-4">{txn.member_id}</td>
                  <td className="px-6 py-4 text-red-500">{txn.expected_return_date}</td>
                  <td className="px-6 py-4">{txn.days_overdue} days</td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₹{txn.current_fine}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverdueReturns;