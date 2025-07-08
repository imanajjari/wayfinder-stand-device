import React from 'react';
import { usePath } from '../../contexts/PathContext';


export default function PathTestButton() {
    const { fetchPath, loading, path } = usePath();
  
    const handleClick = () => {
      // مسیر تستی (x, y) بدون z
      const from = { x: 58, y: 185 };
      const to = { x: 75, y: 1891 };
  
      fetchPath(from, to);
    };
  
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <button
          onClick={handleClick}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? 'در حال دریافت مسیر...' : 'دریافت مسیر تستی'}
        </button>
  
      </div>
    );
  }