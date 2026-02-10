import type { Sale } from '@/types';

export function generateReceipt(sale: Sale): string {
  const receipt = `
========================================
        GYMFLOW POS RECEIPT
========================================
Sale ID: ${sale.id}
Date: ${new Date(sale.createdAt).toLocaleString()}
Staff: ${sale.staffId}
Shift: ${sale.shiftId}
========================================

Items:
${sale.items.map(item => `
${item.product.name}
  Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${item.subtotal.toFixed(2)}
`).join('')}

========================================
Subtotal:        $${sale.total.toFixed(2)}
Tax:             $${(sale.tax || 0).toFixed(2)}
Discount:        -$${(sale.discount || 0).toFixed(2)}
----------------------------------------
TOTAL:           $${sale.total.toFixed(2)}
========================================
Payment Method: ${sale.paymentMethod.toUpperCase()}

Thank you for your business!
========================================
  `.trim();

  return receipt;
}

export function printReceipt(receipt: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write('<pre>' + receipt + '</pre>');
    printWindow.document.close();
    printWindow.print();
  }
}
