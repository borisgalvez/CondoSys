// utils/generateExpensePDF.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExpensePDFProps {
  expenseNumber: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  block?: string | null;
}

export function generateExpensePDF({
  expenseNumber,
  description,
  amount,
  date,
  category,
  block,
}: ExpensePDFProps) {
  const doc = new jsPDF();

  doc.setFont('courier', 'normal');
  doc.setFontSize(14);
  doc.text('RECIBO DE EGRESO', 105, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Número: ${expenseNumber}`, 10, 30);
  doc.text(`Fecha: ${date}`, 160, 30);

  doc.text(`Descripción: ${description}`, 10, 40);
  doc.text(`Categoría: ${category}`, 10, 47);
  if (block) doc.text(`Bloque: ${block}`, 10, 54);

  autoTable(doc, {
    startY: 63,
    head: [['CONCEPTO', 'MONTO']],
    body: [[description, `$${amount.toFixed(2)}`]],
    styles: { font: 'courier', fontSize: 10 },
    headStyles: { fillColor: [0, 0, 0], textColor: 255 },
    columnStyles: {
      1: { halign: 'right' },
    },
  });

  doc.text(`TOTAL: $${amount.toFixed(2)}`, 160, doc.lastAutoTable.finalY + 10, {
    align: 'right',
  });

  doc.setFontSize(9);
  doc.text(
    'Este documento es un comprobante digital de egreso generado automáticamente.',
    10,
    doc.lastAutoTable.finalY + 25
  );

  doc.save(`egreso-${expenseNumber}.pdf`);
}
