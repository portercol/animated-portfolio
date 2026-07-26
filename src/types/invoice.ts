export type InvoiceStatus = "Outstanding" | "Paid";

export interface InvoiceItem {
  description: string;
  hours: number;
  rate: number;
}

export interface Invoice {
  id: string;
  uid: string;
  invoiceNumber: string;
  clientName: string;
  projectTitle: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
}