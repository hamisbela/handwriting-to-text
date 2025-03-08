import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker source to match the library version
const workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

interface PageInfo {
  dataUrl: string;
  pageNumber: number;
  totalPages: number;
}

/**
 * Converts a PDF file to an array of image data URLs
 */
export async function pdfToImages(pdfFile: File, pageLimit: number = 10): Promise<PageInfo[]> {
  try {
    // Validate file is a PDF
    if (pdfFile.type !== 'application/pdf') {
      throw new Error('The provided file is not a PDF.');
    }
    
    // Read the file as ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const totalPages = pdf.numPages;
    const pagesToProcess = Math.min(totalPages, pageLimit);
    const pagePromises: Promise<PageInfo>[] = [];
    
    // Process each page
    for (let i = 1; i <= pagesToProcess; i++) {
      pagePromises.push(renderPageAsImage(pdf, i, totalPages));
    }
    
    return await Promise.all(pagePromises);
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF. Please try another file.');
  }
}

/**
 * Renders a PDF page as an image data URL
 */
async function renderPageAsImage(pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number, totalPages: number): Promise<PageInfo> {
  try {
    // Get the page
    const page = await pdf.getPage(pageNumber);
    
    // Set scale for better readability (adjust as needed)
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    
    // Prepare canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!context) {
      throw new Error('Canvas context could not be created');
    }
    
    // Set canvas dimensions
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // Convert canvas to data URL (JPEG for better compression)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    
    // Clean up to help with memory management
    canvas.width = 0;
    canvas.height = 0;
    
    return {
      dataUrl,
      pageNumber,
      totalPages
    };
  } catch (error) {
    console.error('Error rendering PDF page:', error);
    throw new Error(`Failed to render page ${pageNumber}`);
  }
}