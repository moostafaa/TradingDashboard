
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-gray-100 py-3 px-6 flex justify-between items-center shadow-md">
      {/* Left section: Logo and Nav */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center text-xl font-bold">
          <span className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white mr-2">S</span>
          SOROOSHX
        </div>
        <nav className="hidden md:flex space-x-6">
          {['Home', 'Trade', 'Ideas', 'Support', 'Downloads', 'More'].map((item) => (
            <a key={item} href="#" className="hover:text-orange-400 transition-colors">
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Right section: Account and Download */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-1 hover:text-orange-400 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="hidden sm:inline">Account</span>
        </button>
        <button className="hover:text-orange-400 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;