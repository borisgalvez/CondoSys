// utils/generateInvoicePDF.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceItem {
  description: string;
  amount: number;
}

interface GenerateInvoiceProps {
  invoiceNumber: number;
  date: string;
  owner: string;
  tenant: string
  apartment: string;
  reference: string;
  confirmed: boolean;
  items: InvoiceItem[];
}

export function generateInvoicePDF({
  invoiceNumber,
  date,
  owner,
  tenant,
  apartment,
  reference,
  confirmed,
  items,
}: GenerateInvoiceProps) {
  const doc = new jsPDF();

  doc.setFont('courier', 'normal');
  doc.setFontSize(14);
  doc.text('FACTURA DE CONDÓMINO', 105, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Número: ${invoiceNumber}`, 10, 30);
  doc.text(`Fecha: ${date}`, 160, 30);

  doc.text(`Propietario: ${owner}`, 10, 40);
  doc.text(`Inquilino: ${tenant}`, 10, 47);
  doc.text(`Apartamento: ${apartment}`, 10, 54);
  doc.text(`Referencia: ${reference}`, 10, 61);
  doc.text(`Estado: ${confirmed ? 'CONFIRMADO' : 'PENDIENTE'}`, 10, 68);

  autoTable(doc, {
    startY: 77,
    head: [['DESCRIPCIÓN', 'MONTO']],
    body: items.map((item) => [item.description, `$${item.amount.toFixed(2)}`]),
    theme: 'grid',
    styles: { font: 'courier', fontSize: 10 },
    headStyles: { fillColor: [0, 0, 0], textColor: 255 },
    columnStyles: {
      1: { halign: 'right' },
    },
  });

  const total = items.reduce((acc, curr) => acc + curr.amount, 0);
  doc.text(`TOTAL: $${total.toFixed(2)}`, 160, doc.lastAutoTable.finalY + 10, {
    align: 'right',
  });

  doc.save(`factura-${invoiceNumber}.pdf`);
}
