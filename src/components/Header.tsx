import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Menu, X, PenTool, FileText, File as FilePdf } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-16 flex items-center justify-between">
          <Link to="/" className="text-lg sm:text-xl font-bold text-white flex-shrink-0 flex items-center">
            <PenTool className="h-6 w-6 text-blue-200 mr-2" />
            <span className="font-extrabold">HandwritingToText</span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300 sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <div className="flex items-center gap-1 text-blue-100 hover:text-white transition-colors duration-200 mr-2">
              <FilePdf className="h-4 w-4 text-blue-200" />
              <span>PDF Ready</span>
            </div>
            <Link to="/about" className="text-blue-100 hover:text-white transition-colors duration-200">About</Link>
            <Link to="/contact" className="text-blue-100 hover:text-white transition-colors duration-200">Contact</Link>
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=handwriting-to-text"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-md hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-md transform hover:scale-105 font-medium"
            >
              <Coffee className="h-4 w-4" />
              Buy us a coffee
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-4 space-y-1 border-t border-blue-500">
            <div className="flex items-center gap-1 px-3 py-2 text-base font-medium text-blue-100">
              <FilePdf className="h-4 w-4 text-blue-200" />
              <span>PDF Ready</span>
            </div>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-blue-100 hover:text-white hover:bg-blue-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-blue-100 hover:text-white hover:bg-blue-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=handwriting-to-text"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 bg-yellow-400 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <Coffee className="h-4 w-4" />
              Buy us a coffee
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}