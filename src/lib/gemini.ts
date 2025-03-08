import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Default prompt for handwriting text extraction
const DEFAULT_PROMPT = "Extract and transcribe all text from this handwritten document image. Please provide a clear and accurate transcription of all visible text, maintaining the original formatting where possible. If there are multiple sections or paragraphs, preserve that structure. If any text is unclear or illegible, indicate with [illegible]. Focus on accuracy and readability in the transcription.";

export async function analyzeImage(imageData: string, customPrompt?: string): Promise<string> {
  try {
    // Validate image data
    if (!imageData || !imageData.includes('base64')) {
      throw new Error('Invalid image data format');
    }

    // Use the flash model for faster processing and better OCR capabilities
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Extract base64 data correctly, handling different data URL formats
    const base64Data = imageData.split('base64,')[1];
    if (!base64Data) {
      throw new Error('Invalid base64 image data');
    }
    
    const prompt = customPrompt?.trim() || DEFAULT_PROMPT;
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No text extracted from the handwritten document');
    }
    
    return text;
  } catch (error) {
    console.error('Error analyzing handwritten image:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from handwriting: ${error.message}`);
    }
    throw new Error('Failed to extract text from handwriting. Please try again.');
  }
}