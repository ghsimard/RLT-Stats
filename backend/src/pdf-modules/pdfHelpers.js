/**
 * This file contains helper functions to work around TypeScript issues in the PDF generation code
 */

/**
 * Helper function for PDFKit circle method
 * @param {object} doc - PDFKit document instance
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @param {number} radius - circle radius
 * @returns {object} The PDFKit document instance for chaining
 */
function drawCircle(doc, x, y, radius) {
  if (doc && typeof doc.circle === 'function') {
    return doc.circle(x, y, radius);
  }
  return doc;
}

/**
 * Helper function for PDFKit fill method with color
 * @param {object} doc - PDFKit document instance 
 * @param {string} [color] - Color to fill with
 * @returns {object} The PDFKit document instance for chaining
 */
function drawFill(doc, color) {
  if (doc) {
    if (color && typeof doc.fillColor === 'function') {
      doc.fillColor(color);
    }
    if (typeof doc.fill === 'function') {
      return doc.fill();
    }
  }
  return doc;
}

/**
 * Helper function for PDFKit underline method
 * @param {object} doc - PDFKit document instance
 * @param {string|number} arg1 - First argument (text or x coordinate)
 * @param {number} [arg2] - Second argument (y coordinate if arg1 is x)
 * @param {number} [arg3] - Third argument (x2 coordinate if arg1 is x)
 * @param {number} [arg4] - Fourth argument (y2 coordinate if arg1 is x)
 * @param {object} [options] - Options object
 * @returns {object} The PDFKit document instance for chaining
 */
function drawUnderline(doc, arg1, arg2, arg3, arg4, options) {
  if (doc && typeof doc.underline === 'function') {
    if (typeof arg1 === 'string') {
      return doc.underline(arg1);
    } else {
      return doc.underline(arg1, arg2, arg3, arg4, options);
    }
  }
  return doc;
}

module.exports = {
  drawCircle,
  drawFill,
  drawUnderline
}; 