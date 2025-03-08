import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, User, Tag, BookOpen, FileText, Coffee, FileSpreadsheet, File as FilePdf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-t border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PenTool className="h-7 w-7 text-blue-200" />
              <h3 className="text-xl font-bold text-white">Handwriting to Text</h3>
            </div>
            <p className="text-blue-100">
              Your AI-powered companion for converting handwritten documents to digital text. 
              Upload any handwritten note image or PDF and get instant, accurate text conversion.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <FileText className="h-5 w-5 text-indigo-300 mr-2" />
              Resources
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 group">
                <PenTool className="h-5 w-5 text-blue-300 group-hover:text-white transition-colors duration-300" />
                <Link to="/" className="text-blue-100 hover:text-white transition-colors duration-300">
                  Handwriting Converter
                </Link>
              </li>
              <li className="flex items-center gap-2 group">
                <FilePdf className="h-5 w-5 text-blue-300 group-hover:text-white transition-colors duration-300" />
                <Link to="/" className="text-blue-100 hover:text-white transition-colors duration-300">
                  PDF Support
                </Link>
              </li>
              <li className="flex items-center gap-2 group">
                <Tag className="h-5 w-5 text-blue-300 group-hover:text-white transition-colors duration-300" />
                <Link to="/about" className="text-blue-100 hover:text-white transition-colors duration-300">
                  About Our Service
                </Link>
              </li>
              <li className="flex items-center gap-2 group">
                <User className="h-5 w-5 text-blue-300 group-hover:text-white transition-colors duration-300" />
                <Link to="/contact" className="text-blue-100 hover:text-white transition-colors duration-300">
                  Get Help
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Support Our Project</h3>
            <p className="text-blue-100 mb-6">
              Help us maintain and improve our free handwriting to text converter tool for everyone who wants to digitize their handwritten notes and documents more effectively.
            </p>
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=handwriting-to-text"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-md transform hover:scale-105 font-medium"
            >
              <Coffee className="h-5 w-5" />
              Buy us a coffee
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-blue-500">
          <div className="text-center text-blue-200">
            <p className="mb-2">&copy; {new Date().getFullYear()} Handwriting to Text. Helping individuals and businesses digitize handwritten content efficiently.</p>
            <p className="text-sm">
              For informational purposes only. Our handwriting to text converter tool provides extraction services, not perfect accuracy.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}