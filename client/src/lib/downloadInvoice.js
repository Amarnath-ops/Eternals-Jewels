import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const downloadInvoice = (order) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text("Eternals", 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Premium Fashion & Accessories", 20, 30);
  doc.text("Kerala, India", 20, 35);
  doc.text("Email: support@eternals.com", 20, 40);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("INVOICE", 150, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(`Invoice No: INV-${order._id.slice(-6).toUpperCase()}`, 150, 28);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 150, 34);
  doc.text(`Order ID: ${order._id}`, 150, 40);

  doc.setLineWidth(0.5);
  doc.setDrawColor(200);
  doc.line(20, 45, 190, 45);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("Bill To:", 20, 55);

  doc.setFontSize(10);
  doc.setTextColor(50);
  
  const address = order.shippingAddress;
  doc.text(address.fullname || "Customer", 20, 62);
  doc.text(address.address, 20, 67);
  doc.text(`${address.city}, ${address.state} - ${address.pincode}`, 20, 72);
  doc.text(`Phone: ${address.phone}`, 20, 77);

  const tableColumn = ["#", "Product", "Qty", "Unit Price", "Status", "Total"];
  const tableRows = [];

  const orderItems = order.orderItems || [];
  
  orderItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    const row = [
      index + 1,
      item.productName,
      item.quantity,
      `Rs. ${item.price.toLocaleString("en-IN")}`,
      item.itemStatus,
      `Rs. ${itemTotal.toLocaleString("en-IN")}`,
    ];
    tableRows.push(row);
  });

  autoTable(doc, {
    startY: 85,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  
  const subtotal = order.totalAmount;
  const discount = order.discountAmount || 0;
  const deliveryFee = (order.finalAmount - (subtotal - discount)) > 0 ? (order.finalAmount - (subtotal - discount)) : 0;
  const total = order.finalAmount;
  
  doc.setFontSize(10);
  doc.setTextColor(50);
  
  const rightAlignText = (text, y) => {
      const textWidth = doc.getTextWidth(text);
      doc.text(text, 190 - textWidth, y);
  };

  doc.text("Subtotal:", 140, finalY);
  rightAlignText(`Rs. ${subtotal.toLocaleString("en-IN")}`, finalY);

  if (discount > 0) {
      doc.text("Discount:", 140, finalY + 6);
      doc.setTextColor(220, 38, 38); 
      rightAlignText(`- Rs. ${discount.toLocaleString("en-IN")}`, finalY + 6);
      doc.setTextColor(50); 
  }

  doc.text("Delivery Fee:", 140, finalY + 12);
  rightAlignText(`Rs. ${deliveryFee > 0 ? deliveryFee.toLocaleString("en-IN") : "Free"}`, finalY + 12);

  doc.setDrawColor(200);
  doc.line(140, finalY + 16, 190, finalY + 16);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); 
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", 140, finalY + 22);
  rightAlignText(`Rs. ${total.toLocaleString("en-IN")}`, finalY + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(150);
  
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 20;
  
  doc.text("Thank you for choosing Eternals!", 105, footerY, { align: "center" });
  doc.text("For support, contact: support@eternals.com", 105, footerY + 5, { align: "center" });

  doc.save(`Invoice_${order._id}.pdf`);
};

export default downloadInvoice;
