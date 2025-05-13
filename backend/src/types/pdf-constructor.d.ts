import PDFKit from 'pdfkit';

// This fixes the "Type has no construct signatures" error
declare module 'pdfkit' {
  // Add a constructor signature
  export default interface PDFKit {
    new(options?: PDFKit.PDFDocumentOptions): PDFKit.PDFDocument;
  }
  
  // Define the actual default export as a constructor function
  const PDFDocument: {
    new(options?: PDFKit.PDFDocumentOptions): PDFKit.PDFDocument;
  };
  
  export = PDFDocument;
} 