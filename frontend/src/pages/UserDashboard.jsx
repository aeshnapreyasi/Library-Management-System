import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FileText, ArrowRight, ArrowLeft, Banknote, LogOut, LayoutDashboard } from 'lucide-react';

// Import only allowed modules for users
import IssueBook from '../components/modules/IssueBook';
import ReturnBook from '../components/modules/ReturnBook';
import PayFine from '../components/modules/PayFine';
import OverdueReturns from '../components/modules/OverdueReturns';

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');

  // RBAC: No Maintenance section
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} />, category: 'General' },

    // Transactions
    { id: 'issue', label: 'Issue Item', icon: <ArrowRight size={20} />, category: 'Transactions' },
    { id: 'return', label: 'Return Item', icon: <ArrowLeft size={20} />, category: 'Transactions' },
    { id: 'fine', label: 'Pay Fine', icon: <Banknote size={20} />, category: 'Transactions' },

    // Reports
    { id: 'overdue', label: 'Overdue Returns', icon: <FileText size={20} />, category: 'Reports' },
  ];

  return (
    <div className="flex h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 mt-4">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-green-600 dark:text-green-400">User Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Logged in as: {user?.username}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                activeTab === item.id 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="animate-in fade-in duration-300">

          {activeTab === 'overview' && (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-2">Welcome to the User Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Use the sidebar to issue, return items, or view your reports.
              </p>
            </div>
          )}

          {/* Component Mounting */}
          {activeTab === 'issue' && <IssueBook />}
          {activeTab === 'return' && <ReturnBook />}
          {activeTab === 'fine' && <PayFine />}
          {activeTab === 'overdue' && <OverdueReturns />}

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;