import fs from 'fs/promises';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export const extractTextFromPDF = async (filePath) => {
  try {
    const pdfBuffer = await fs.readFile(filePath);
    
    const data = await pdf(pdfBuffer); 
    
    return {
      text: data.text ? data.text.trim() : "",
      numPages: data.numpages || 1,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};