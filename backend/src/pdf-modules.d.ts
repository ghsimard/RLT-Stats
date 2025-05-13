// Type definitions for pdf generator module
import PDFKit from 'pdfkit';

declare module 'pdf-modules/pdfGenerator' {
  export function generatePDF(school: string): Promise<PDFKit.PDFDocument>;
} 