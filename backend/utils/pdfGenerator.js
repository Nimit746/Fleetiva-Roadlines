const PDFDocument = require('pdfkit');

exports.generateBiltyPDF = (booking, res) => {
  const doc = new PDFDocument({ margin: 30 });
  const copies = ['Consignor Copy', 'Consignee Copy', 'Driver Copy', 'Transport Copy'];

  copies.forEach((title, index) => {
    doc.fontSize(20).text('LOGISTICS BILTY', { align: 'center' });
    doc.fontSize(10).text(title, { align: 'right' });
    doc.moveDown();
    doc.fontSize(12).text(`Bilty No: BIL-${booking._id.toString().slice(-6).toUpperCase()}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Vehicle No: ${booking.truck.vehicleNumber}`);
    doc.text(`From: ${booking.from}`);
    doc.text(`To: ${booking.to}`);
    doc.text(`Material: ${booking.load.material}`);
    doc.text(`Weight: ${booking.load.requiredCapacity} Tons`);
    doc.moveDown();
    doc.text('--------------------------------------------------');
    doc.text('Terms & Conditions: Goods carried at owner risk.');
    
    if (index < copies.length - 1) doc.addPage();
  });

  doc.pipe(res);
  doc.end();
};

exports.generateInvoicePDF = (booking, res) => {
  const doc = new PDFDocument({ margin: 50 });
  const total = booking.amount + booking.gstAmount;

  doc.fontSize(20).text('GST INVOICE', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice No: INV-${booking._id.toString().slice(-6).toUpperCase()}`);
  doc.text(`Customer: ${booking.customer.name}`);
  doc.text(`Route: ${booking.from} to ${booking.to}`);
  doc.moveDown();
  
  doc.text(`Base Amount: Rs. ${booking.amount.toFixed(2)}`);
  doc.text(`GST (12%): Rs. ${booking.gstAmount.toFixed(2)}`);
  doc.text('-----------------------------------');
  doc.fontSize(14).text(`Total Payable: Rs. ${total.toFixed(2)}`, { bold: true });
  
  doc.pipe(res);
  doc.end();
};