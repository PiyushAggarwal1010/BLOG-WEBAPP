import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center max-w-xs">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-stone-700 rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
