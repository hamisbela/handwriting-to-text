import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, PenTool, Loader2, ClipboardCheck, Download, ChevronLeft, ChevronRight, File as FilePdf } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import { pdfToImages } from '../lib/pdfUtils';
import SupportBlock from '../components/SupportBlock';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [pdfPages, setPdfPages] = useState<Array<{ dataUrl: string; pageNumber: number; totalPages: number }>>([]);
  const [currentPdfPage, setCurrentPdfPage] = useState(0);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setPdfPages([]);
    setImage(null);
    setAnalysis('');

    try {
      if (file.type === 'application/pdf') {
        setFileType('pdf');
        const pages = await pdfToImages(file);
        setPdfPages(pages);
        setCurrentPdfPage(0);
        
        if (pages.length > 0) {
          await handleAnalyze(pages[0].dataUrl);
        }
      } else if (file.type.startsWith('image/')) {
        setFileType('image');
        if (file.size > 20 * 1024 * 1024) {
          throw new Error('Image size should be less than 20MB');
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          setImage(base64String);
          await handleAnalyze(base64String);
        };
        reader.onerror = () => {
          throw new Error('Failed to read the image file. Please try again.');
        };
        reader.readAsDataURL(file);
      } else {
        throw new Error('Please upload a valid PDF or image file');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process the file. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      if (e.target) e.target.value = '';
    }
  }, []);

  const handleAnalyze = async (imageData: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeImage(imageData);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract text from handwriting. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changePdfPage = async (direction: 'next' | 'prev') => {
    if (pdfPages.length === 0) return;
    
    let newPage = currentPdfPage;
    
    if (direction === 'next' && currentPdfPage < pdfPages.length - 1) {
      newPage = currentPdfPage + 1;
    } else if (direction === 'prev' && currentPdfPage > 0) {
      newPage = currentPdfPage - 1;
    }
    
    if (newPage !== currentPdfPage) {
      setCurrentPdfPage(newPage);
      await handleAnalyze(pdfPages[newPage].dataUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    
    try {
      navigator.clipboard.writeText(analysis);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      setError('Failed to copy to clipboard. Please try again.');
    }
  };

  const renderFilePreview = () => {
    if (fileType === 'pdf' && pdfPages.length > 0) {
      const currentPage = pdfPages[currentPdfPage];
      return (
        <div className="mb-8">
          <div className="relative rounded-xl mb-4 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-inner p-2">
            <img
              src={currentPage.dataUrl}
              alt={`Handwritten document page ${currentPage.pageNumber} of ${currentPage.totalPages}`}
              className="w-full h-auto max-h-[500px] object-contain mx-auto rounded-lg"
            />
            {pdfPages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
                <button 
                  onClick={() => changePdfPage('prev')}
                  disabled={currentPdfPage === 0}
                  className="p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 disabled:opacity-50"
                >
                  <ChevronLeft className="h-6 w-6 text-blue-700" />
                </button>
                <span className="px-4 py-2 bg-white bg-opacity-80 rounded-full text-blue-800 font-medium">
                  Page {currentPage.pageNumber} of {currentPage.totalPages}
                </span>
                <button 
                  onClick={() => changePdfPage('next')}
                  disabled={currentPdfPage === pdfPages.length - 1}
                  className="p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 disabled:opacity-50"
                >
                  <ChevronRight className="h-6 w-6 text-blue-700" />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleAnalyze(pdfPages[currentPdfPage].dataUrl)}
              disabled={loading}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow-md transform hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Converting...
                </>
              ) : (
                <>
                  <FileText className="-ml-1 mr-2 h-5 w-5" />
                  Convert to Text
                </>
              )}
            </button>
            <button
              onClick={triggerFileInput}
              className="flex items-center justify-center px-6 py-3 border border-blue-300 text-base font-medium rounded-xl text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform hover:scale-105 transition-all duration-300"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Another
            </button>
          </div>
        </div>
      );
    } else if (fileType === 'image' && image) {
      return (
        <div className="mb-8">
          <div className="relative rounded-xl mb-6 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-inner p-2">
            <img
              src={image}
              alt="Handwritten document to convert to text"
              className="w-full h-auto max-h-[500px] object-contain mx-auto rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => image && handleAnalyze(image)}
              disabled={loading}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow-md transform hover:scale-105 transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Converting...
                </>
              ) : (
                <>
                  <FileText className="-ml-1 mr-2 h-5 w-5" />
                  Convert to Text
                </>
              )}
            </button>
            <button
              onClick={triggerFileInput}
              className="flex items-center justify-center px-6 py-3 border border-blue-300 text-base font-medium rounded-xl text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform hover:scale-105 transition-all duration-300"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Another
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <PenTool className="h-10 w-10 text-blue-600 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">Free Handwriting to Text Converter</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Upload any handwritten document image or PDF and instantly convert to digital text. Save time and eliminate manual typing with our free handwriting to text converter.</p>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-12 border border-blue-100 transition-all hover:shadow-2xl">
          <div className="flex flex-col items-center justify-center mb-8">
            <label 
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 cursor-pointer w-full sm:w-auto transform hover:scale-105 shadow-md"
            >
              <Upload className="h-5 w-5" />
              Upload Handwritten Document
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                onChange={handleFileUpload}
              />
            </label>
            <p className="mt-3 text-sm text-gray-500">PDF, PNG, JPG, JPEG or WEBP (MAX. 20MB)</p>
            <div className="flex gap-2 mt-2">
              <FilePdf className="h-5 w-5 text-red-500" />
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md border border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && !image && pdfPages.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
              <span className="text-blue-600 font-medium">Converting handwriting to text...</span>
            </div>
          )}

          {renderFilePreview()}

          {analysis && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 border border-blue-100 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FileText className="h-7 w-7 text-blue-600 mr-2" />
                  Extracted Text
                </h2>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  <ClipboardCheck className="h-5 w-5" />
                  <span className="hidden sm:inline">Copy Text</span>
                </button>
              </div>
              <div className="text-gray-700 bg-white p-4 rounded-lg border border-blue-100 shadow-inner whitespace-pre-wrap font-mono">
                {analysis}
              </div>
            </div>
          )}
        </div>

        <SupportBlock />

        <div className="prose max-w-none my-12 p-8 bg-white rounded-xl shadow-lg border border-blue-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-blue-800">Free Handwriting to Text Converter: Convert Handwritten Notes Instantly</h2>
          
          <p>Welcome to our cutting-edge <strong>free handwriting to text converter</strong> tool, designed to help you convert handwritten documents to digital text quickly and accurately. Our <strong>free handwriting to text converter</strong> provides detailed text extraction from handwritten notes, eliminating manual typing and reducing errors.</p>

          <h3 className="text-blue-700">How Our Free Handwriting to Text Converter Works</h3>
          <p>Our sophisticated <strong>free handwriting to text converter</strong> uses advanced OCR and machine learning technology to analyze your handwritten documents and convert them to digital text. Simply upload your handwritten note, and our <strong>free handwriting to text converter</strong> will provide accurate text conversion. Whether you're digitizing class notes or converting written documents, our <strong>free handwriting to text converter</strong> gives you the accurate text you need.</p>

          <h3 className="text-blue-700">Why Choose Our Free Handwriting to Text Converter</h3>
          <ul>
            <li>Advanced <strong>free handwriting to text converter</strong> technology that provides accurate text extraction</li>
            <li>Supports both PDF and image formats of handwritten documents</li>
            <li>Detailed extraction of handwritten text with preserved formatting</li>
            <li>Comprehensive handwriting recognition with structured output</li>
            <li>Fast processing with instant results for your uploaded documents</li>
            <li>Easy copy-paste functionality for extracted text</li>
            <li>100% <strong>free handwriting to text converter</strong> with no hidden costs</li>
            <li>Privacy-focused approach that doesn't store your documents</li>
            <li>Time-saving solution that reduces manual typing</li>
            <li>Multi-page PDF support for processing complete documents</li>
          </ul>

          <h3 className="text-blue-700">When to Use Our Free Handwriting to Text Converter:</h3>
          <ul>
            <li>When digitizing handwritten class notes</li>
            <li>For converting written documents to editable text</li>
            <li>When you need to quickly extract text from handwritten notes</li>
            <li>For creating digital copies of written content</li>
            <li>To reduce errors in manual transcription</li>
            <li>When building digital archives of handwritten documents</li>
            <li>For students and professionals looking to digitize notes</li>
            <li>When you need to convert handwritten PDF documents to text</li>
          </ul>

          <p>Try our <strong>free handwriting to text converter</strong> today and experience the efficiency of automated handwriting recognition. No registration required – simply upload your handwritten document and let our <strong>free handwriting to text converter</strong> extract the text instantly! Our <strong>free handwriting to text converter</strong> tool helps you process handwritten documents faster and more accurately than ever before.</p>
        </div>

        <SupportBlock />
      </div>
    </div>
  );
}