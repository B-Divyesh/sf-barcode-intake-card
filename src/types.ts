export interface IntakeItem {
  id: string;
  barcode: string;
  name: string;
  supplier: string;
  location: string;
  quantity: number;
  notes: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CsvMatch {
  [key: string]: string | undefined;
  barcode: string;
  name?: string;
  supplier?: string;
  location?: string;
  quantity?: string;
}
