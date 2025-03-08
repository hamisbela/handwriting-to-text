import React from 'react';
import { PenTool, File as FilePdf } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Our Handwriting to Text Converter</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 prose max-w-none">
          <p>
            Welcome to Handwriting to Text, your trusted resource for AI-powered handwriting recognition.
            We're passionate about helping individuals and businesses digitize handwritten content quickly and accurately,
            and discover how automation can streamline your document conversion through advanced technology
            that analyzes and extracts text from handwritten documents and PDFs.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make handwriting digitization accessible to everyone by providing a free, easy-to-use
            handwriting to text converter tool. In a digital world where typed text is crucial, we aim to help you
            automate manual transcription, reduce errors, and receive accurate digital text from your handwritten documents.
            Our free handwriting to text converter tool is designed to empower users with accurate extraction and clear output,
            helping more people streamline their document digitization and save valuable time.
          </p>

          <h2>Why Choose Our Handwriting to Text Converter?</h2>
          <ul>
            <li>Advanced AI OCR algorithms trained on diverse handwriting styles</li>
            <li>PDF support for multi-page handwritten documents</li>
            <li>Detailed text extraction with preserved formatting</li>
            <li>Comprehensive detection of handwritten characters and words</li>
            <li>Easy copy-paste functionality for extracted text</li>
            <li>Accurate conversion of handwritten content to digital text</li>
            <li>Time-saving automation that reduces manual transcription</li>
            <li>Completely free to use handwriting to text converter tool</li>
            <li>No registration required</li>
            <li>Privacy-focused approach</li>
            <li>User-friendly interface for people of all tech levels</li>
          </ul>

          <h2>Support Our Project</h2>
          <p>
            We're committed to keeping this handwriting to text converter tool free and accessible to everyone.
            If you find our tool useful, consider supporting us by buying us a coffee.
            Your support helps us maintain and improve the service, ensuring it remains available to all
            who want to automate their handwriting digitization process.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=handwriting-to-text"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-lg font-semibold"
            >
              Support Our Work
            </a>
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
              <PenTool className="h-5 w-5 text-blue-500 mr-2" />
              <FilePdf className="h-5 w-5 text-red-500 mr-2" />
              Important Disclaimer
            </h3>
            <p className="text-gray-700">
              While our free handwriting to text converter tool uses sophisticated algorithms to extract text from handwritten documents, it's important to understand that automated extraction may not be 100% accurate in all cases, especially with complex or unclear handwriting.
            </p>
            <p className="text-gray-700 mt-2">
              Our free handwriting to text converter tool should be used as a helpful aid in your document digitization process, not as a complete replacement for human verification. We recommend reviewing the extracted text for accuracy before using it in your documents. We do not store your handwritten documents, and you are responsible for the security and privacy of the files you upload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}