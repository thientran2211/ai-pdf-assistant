import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<{text: string, numPages: number}>} 
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    // Đọc file PDF thành Buffer
    const dataBuffer = await fs.readFile(filePath);
    
    // Parse PDF - pdf-parse chấp nhận Buffer trực tiếp
    const data = await pdfParse(dataBuffer);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};