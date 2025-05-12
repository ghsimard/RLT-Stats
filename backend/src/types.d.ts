// Declare modules that don't have type definitions
declare module 'pdfkit';
declare module 'pg';
declare module 'cors';
declare module 'express';

// Define CustomPDFKit interface without dependency on PDFKit namespace
interface CustomPDFKit {
  rect(x: number, y: number, w: number, h: number): this;
  fillColor(color: string, opacity?: number): this;
  fontSize(size: number): this;
  font(name: string): this;
  save(): this;
  restore(): this;
  moveDown(lines?: number): this;
  fill(color?: string): this;
  stroke(color?: string): this;
  fillAndStroke(fillColor?: string, strokeColor?: string): this;
  circle(x: number, y: number, radius: number): this;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): this;
  text(text: string, x?: number, y?: number, options?: any): this;
  lineTo(x: number, y: number): this;
  lineWidth(width: number): this;
  strokeColor(color: string, opacity?: number): this;
  dash(length: number, options?: any): this;
  moveTo(x: number, y: number): this;
  image(src: string, x?: number, y?: number, options?: any): this;
  addPage(options?: any): this;
  pipe(destination: any): this;
  end(): void;
  widthOfString(text: string, options?: any): number;
  page: {
    width: number;
    height: number;
  };
  x: number;
  y: number;
  closePath(): this;
} 