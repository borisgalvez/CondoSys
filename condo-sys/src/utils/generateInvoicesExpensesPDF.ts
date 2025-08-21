// utils/generateReport.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ReportData = {
  incomes: number;
  expenses: number;
  utility: number;
  table: Array<{ concept: string; amount: number }>;
};

export function generatePDFReport(data: ReportData) {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text('Reporte Financiero', 14, 20);

  // Ingresos, gastos, utilidad
  doc.setFontSize(12);
  doc.text(`Ingresos: $${data.incomes.toFixed(2)}`, 14, 35);
  doc.text(`Gastos: $${data.expenses.toFixed(2)}`, 14, 43);
  doc.text(`Utilidad: $${data.utility.toFixed(2)}`, 14, 51);

  // Tabla de datos
  autoTable(doc, {
    startY: 60,
    head: [['Concepto', 'Monto']],
    body: data.table.map(item => [item.concept, `$${item.amount.toFixed(2)}`]),
  });

  // Descargar PDF
  doc.save('reporte-financiero.pdf');
}
