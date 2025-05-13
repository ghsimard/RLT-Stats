import PDFKit from 'pdfkit';

declare module 'pdfkit' {
  interface PDFDocument {
    // Basic methods
    rect(x: number, y: number, width: number, height: number): this;
    fontSize(size: number): this;
    fillColor(color: string): this;
    fill(): this;
    text(text: string, x?: number, y?: number, options?: any): this;
    save(): this;
    restore(): this;
    moveTo(x: number, y: number): this;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): this;
    lineTo(x: number, y: number): this;
    
    // Additional methods
    moveDown(lines?: number): this;
    font(font: string): this;
    stroke(): this;
    strokeColor(color: string): this;
    pipe(destination: NodeJS.WritableStream): this;
    end(): void;
    on(event: string, callback: Function): this;
    closePath(): this;
    rotate(angle: number, options?: { origin?: [number, number] }): this;
    
    // Document structure
    addPage(options?: PDFKit.PDFDocumentOptions): this;
  }

  // For the static constructor
  namespace PDFDocument {
    interface PDFDocumentOptions {
      size?: string | [number, number];
      margin?: number;
      margins?: { top: number; left: number; bottom: number; right: number };
      layout?: 'portrait' | 'landscape';
    }
  }

  // Namespaces for PDFPage and Mixins
  namespace Mixins {
    interface AnnotationOption {}
  }

  interface PDFPage {}
}

export interface CustomPDFKit extends PDFKit.PDFDocument {
  rect(x: number, y: number, width: number, height: number): this;
  fontSize(size: number): this;
  fillColor(color: string): this;
  fill(): this;
  text(text: string, x?: number, y?: number, options?: any): this;
  save(): this;
  restore(): this;
  moveTo(x: number, y: number): this;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): this;
  lineTo(x: number, y: number): this;
  
  // Additional methods
  moveDown(lines?: number): this;
  font(font: string): this;
  stroke(): this;
  strokeColor(color: string): this;
  pipe(destination: NodeJS.WritableStream): this;
  end(): void;
  on(event: string, callback: Function): this;
  closePath(): this;
  rotate(angle: number, options?: { origin?: [number, number] }): this;
} 