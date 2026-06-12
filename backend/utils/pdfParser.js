import fs from 'fs/promises';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract text from PDF file
 * Compatible with pdf-parse@1.1.1
 * 
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<{text: string, numPages: number, info: object}>}
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    // Resolve path (handle both absolute and relative)
    let absolutePath = filePath;
    if (!path.isAbsolute(filePath)) {
      absolutePath = path.join(__dirname, '..', filePath);
    }

    // Read PDF file
    const dataBuffer = await fs.readFile(absolutePath);

    const data = await pdfParse(dataBuffer);
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};