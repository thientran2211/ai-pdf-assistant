import fs from 'fs/promises';
import { extractText } from 'pdf-text-extract';

export const extractTextFromPDF = async (filePath) => {
  try {
    const pdfBuffer = await fs.readFile(filePath);
    const text = await extractText(pdfBuffer);
    
    return {
      text: text.trim(),
      numPages: 1,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};