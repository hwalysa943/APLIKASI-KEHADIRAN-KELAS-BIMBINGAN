
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AttendanceRecord } from '../types';
import { OFFICIALS, ALL_PUPILS } from '../constants';

export const generateAttendancePDF = (records: AttendanceRecord[], title: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper for Header
  const addHeader = (d: jsPDF, pageTitle: string) => {
    d.setFontSize(14);
    d.setTextColor(0, 0, 0);
    d.setFont('helvetica', 'bold');
    d.text("SK KG KLID/PLAJAU, DALAT", pageWidth / 2, 15, { align: 'center' });
    d.setFontSize(11);
    d.text("PROGRAM KELAS BIMBINGAN DAN GILAP PERMATA", pageWidth / 2, 22, { align: 'center' });
    d.setFontSize(10);
    d.setFont('helvetica', 'normal');
    d.text(pageTitle, pageWidth / 2, 28, { align: 'center' });
    d.line(14, 32, pageWidth - 14, 32);
  };

  records.forEach((record, index) => {
    if (index > 0) doc.addPage();
    addHeader(doc, `REKOD KEHADIRAN: ${record.date} (${record.time})`);

    let yPos = 40;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`SUBJEK: ${record.subject.toUpperCase()}`, 14, yPos);
    doc.text(`GURU PEMBIMBING: ${record.teacher.toUpperCase()}`, 14, yPos + 5);
    
    yPos += 12;

    // Tambah Info Links jika ada
    if (record.teachingMaterialLinks && record.teachingMaterialLinks.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text("Pautan Bahan Mengajar:", 14, yPos);
      yPos += 4;
      
      doc.setFont('helvetica', 'normal');
      record.teachingMaterialLinks.forEach((link, idx) => {
        doc.text(`${idx + 1}. ${link}`, 14, yPos);
        yPos += 4;
      });
      yPos += 4;
    }

    const tableData = ALL_PUPILS.map((p, i) => [
      i + 1,
      p.name,
      `TAHUN ${p.year}`,
      record.attendance[p.id] ? "HADIR" : "TIDAK HADIR"
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['BIL', 'NAMA MURID', 'TAHUN', 'STATUS KEHADIRAN']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, font: 'helvetica', cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 40, halign: 'center' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 3) {
          if (data.cell.raw === 'HADIR') {
            data.cell.styles.textColor = [0, 128, 0];
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = [200, 0, 0];
          }
        }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    
    // Signatures
    let sigY = finalY + 20;
    if (sigY > pageHeight - 50) {
      doc.addPage();
      addHeader(doc, `PENGESAHAN REKOD: ${record.date}`);
      sigY = 50;
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text("Disediakan oleh,", 14, sigY);
    doc.text("Disemak oleh,", pageWidth / 2 - 20, sigY);
    doc.text("Disahkan oleh,", pageWidth - 60, sigY);

    doc.text("__________________________", 14, sigY + 15);
    doc.text("__________________________", pageWidth / 2 - 20, sigY + 15);
    doc.text("__________________________", pageWidth - 60, sigY + 15);

    doc.setFont('helvetica', 'normal');
    doc.text(record.teacher, 14, sigY + 20, { maxWidth: 50 });
    doc.text("Guru Pembimbing", 14, sigY + 24);

    doc.setFont('helvetica', 'bold');
    doc.text(OFFICIALS.COORDINATOR, pageWidth / 2 - 20, sigY + 20, { maxWidth: 50 });
    doc.setFont('helvetica', 'normal');
    doc.text("Penolong Kanan Pentadbiran", pageWidth / 2 - 20, sigY + 24);

    doc.setFont('helvetica', 'bold');
    doc.text(OFFICIALS.HEADMASTER, pageWidth - 60, sigY + 20, { maxWidth: 50 });
    doc.setFont('helvetica', 'normal');
    doc.text("Guru Besar", pageWidth - 60, sigY + 24);
  });

  doc.save(`Laporan_Kehadiran_${title.replace(/\s+/g, '_')}.pdf`);
};
