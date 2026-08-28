import type { CsvMatch, IntakeItem } from './types';

function quote(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function itemsToCsv(items: IntakeItem[]): string {
  const head = ['barcode', 'name', 'supplier', 'location', 'quantity', 'notes', 'updated_at'];
  return [head.join(','), ...items.map((item) => [item.barcode, item.name, item.supplier, item.location, item.quantity, item.notes, item.updatedAt].map(quote).join(','))].join('\n');
}

export function parseCsv(text: string): CsvMatch[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') { field += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(field.trim()); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; field = '';
    } else field += char;
  }
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  if (!rows.length) return [];
  const headers = rows[0].map((cell) => cell.toLowerCase().replaceAll(' ', '_'));
  const barcodeIndex = headers.findIndex((value) => ['barcode', 'code', 'sku', 'ean', 'upc'].includes(value));
  if (barcodeIndex < 0) throw new Error('The CSV needs a barcode, code, SKU, EAN, or UPC column.');
  return rows.slice(1).filter((cells) => cells[barcodeIndex]).map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ''])) as unknown as CsvMatch);
}
