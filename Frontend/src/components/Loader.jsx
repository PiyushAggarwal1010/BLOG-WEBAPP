import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-stone-950/70 backdrop-blur-sm z-50 flex flex-col justify-center items-center transition-all duration-300">
      <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-xl flex flex-col items-center max-w-xs border border-transparent dark:border-stone-800 transition-colors">
        <div className="w-10 h-10 border-4 border-gray-100 dark:border-stone-700 border-t-stone-700 dark:border-t-white rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-stone-300">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;