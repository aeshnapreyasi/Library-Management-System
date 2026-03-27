import { useState, useEffect } from 'react';
import api from '../../services/api';

const BookAvailability = ({ onSelectBook }) => {
  const [searchData, setSearchData] = useState({ book_name: '', author: '' });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [selectedSerial, setSelectedSerial] = useState(null);
  
  // State to hold unique authors for the dropdown
  const [authors, setAuthors] = useState([]);

  // Fetch authors for the dropdown when the component loads
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await api.get('/reports/master-books');
        // Extract unique authors
        const uniqueAuthors = [...new Set(res.data.map(book => book.author))];
        setAuthors(uniqueAuthors);
      } catch (err) {
        console.error("Failed to load authors");
      }
    };
    fetchAuthors();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    setSelectedSerial(null);

    // Requirement: One of the text box or drop down MUST be filled in
    if (!searchData.book_name && !searchData.author) {
      setError('Please fill in either the Book Name or select an Author to search.');
      return;
    }

    try {
      // Pass the search parameters to the backend
      const res = await api.get(`/transactions/search`, {
        params: {
          name: searchData.book_name,
          author: searchData.author
        }
      });
      
      setResults(res.data);
      if (res.data.length === 0) setError('No books found matching your criteria.');
    } catch (err) {
      setError('Search failed. Please try again.');
    }
  };

  const handleProceed = () => {
    if (!selectedSerial) {
      setError('Please select a book using the radio button.');
      return;
    }
    // Find the exact book object the user selected and pass it to the Issue form
    const selectedBook = results.find(b => b.serial_no === selectedSerial);
    onSelectBook(selectedBook);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Search Form Box */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Is Book Available?</h2>
        
        {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded border border-red-200 text-sm">{error}</div>}

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Enter Book Name</label>
            <input 
              type="text" 
              value={searchData.book_name}
              onChange={(e) => setSearchData({...searchData, book_name: e.target.value})}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="e.g. The Great Gatsby"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Enter Author (Drop Down)</label>
            <select 
              value={searchData.author}
              onChange={(e) => setSearchData({...searchData, author: e.target.value})}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Select Author --</option>
              {authors.map((author, index) => (
                <option key={index} value={author}>{author}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-medium shadow-sm">
            Search
          </button>
        </form>
      </div>

      {/* Search Results Table Box */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                <tr>
                  <th className="p-4">Book Name</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Serial No</th>
                  <th className="p-4">Available</th>
                  <th className="p-4 text-center">Select</th>
                </tr>
              </thead>
              <tbody>
                {results.map((book) => (
                  <tr key={book.serial_no} className={`border-b dark:border-gray-700 ${selectedSerial === book.serial_no ? 'bg-blue-50 dark:bg-gray-700' : ''}`}>
                    <td className="p-4">{book.name}</td>
                    <td className="p-4">{book.author}</td>
                    <td className="p-4 font-mono text-gray-500">{book.serial_no}</td>
                    <td className="p-4">
                      {/* Assuming status is 'available' in your database */}
                      <span className={`px-2 py-1 rounded text-xs font-bold ${book.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {book.status === 'available' ? 'Y' : 'N'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <input 
                        type="radio" 
                        name="selectedBook" 
                        disabled={book.status !== 'available'} // Can't select an unavailable book
                        checked={selectedSerial === book.serial_no}
                        onChange={() => setSelectedSerial(book.serial_no)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 flex justify-end bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">
             <button 
                onClick={handleProceed}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium shadow-sm transition"
             >
               Proceed to Issue
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAvailability;