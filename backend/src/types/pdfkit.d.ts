import PDFKit from 'pdfkit';

declare module 'pdfkit' {
  interface PDFDocument {
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
  }
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
} 