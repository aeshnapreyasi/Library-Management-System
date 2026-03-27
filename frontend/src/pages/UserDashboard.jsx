import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PayFine from '../components/modules/PayFine';
import SystemReports from '../components/modules/SystemReports';

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState('overview');

  // Strictly restricted menu items: Only Overview, Reports, and Fine Payment
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '▢' }, 
    { id: 'reports', label: 'System Reports', icon: '📄' },
    { id: 'fine', label: 'Pay Fine', icon: '◖' }
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-gray-300 font-sans">
      
      {/* Sidebar - Styled to match your dark theme screenshot */}
      <aside className="w-64 bg-[#1e293b] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-green-500">User Portal</h1>
          <p className="text-xs text-gray-400 mt-1">Logged in as: {user?.username || 'User'}</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-green-600 text-white shadow-md' // Bright green active state
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-800 rounded-md text-sm font-medium transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto bg-[#0f172a]">
        <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
          
          {/* Overview Tab with strict instructions */}
          {activeTab === 'overview' && (
            <div className="p-8 bg-[#1e293b] rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-3">Welcome to the User Dashboard</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  You can use this portal to search for available books and movies using the <strong>System Reports</strong> tab, or clear any pending dues using the <strong>Pay Fine</strong> tab.
                </p>
                <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-md text-blue-300">
                  <strong>Notice:</strong> Please visit the Librarian desk to issue or return items. Self-checkout is not permitted.
                </div>
              </div>
            </div>
          )}

          {/* System Reports (For checking Book Availability) */}
          {activeTab === 'reports' && (
             <SystemReports />
          )}

          {/* Pay Fine */}
          {activeTab === 'fine' && (
            <PayFine />
          )}
          
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;