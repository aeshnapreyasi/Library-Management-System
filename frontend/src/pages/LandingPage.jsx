import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
        <BookOpen size={64} className="text-blue-600 dark:text-blue-300" />
      </div>
      
      <h1 className="text-5xl font-bold tracking-tight">
        Modern Library Management
      </h1>
      
      <p className="text-xl max-w-2xl text-gray-600 dark:text-gray-400">
        A complete, extensible solution for managing memberships, tracking inventory, and handling transactions with ease.
      </p>

      <div className="flex space-x-4 pt-4">
        <Link 
          to="/login" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg"
        >
          Sign In
        </Link>
        <Link 
          to="/register" 
          className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 font-medium rounded-lg transition-colors shadow-sm text-gray-900 dark:text-gray-100"
        >
          Register Account
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;