import {
  asDate,
  type Content,
  type DateField,
} from "@prismicio/client";

import type {
  Invoice,
  InvoiceStatus,
} from "@/types/invoice";

function formatInvoiceDate(value: DateField): string {
  const date = asDate(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function normalizeInvoiceStatus(
  status: string | null,
): InvoiceStatus {
  return status === "Paid" ? "Paid" : "Outstanding";
}

export function mapInvoice(
  document: Content.InvoiceDocument,
): Invoice {
  return {
    id: document.id,
    uid: document.uid,
    invoiceNumber: document.data.invoice_number ?? "",
    clientName: document.data.client_name ?? "",
    projectTitle: document.data.project_title ?? "",
    issueDate: formatInvoiceDate(document.data.issue_date),
    dueDate: document.data.due_date_label ?? "",
    status: normalizeInvoiceStatus(document.data.status),
    items: document.data.line_items.map((item) => ({
      description: item.description ?? "",
      hours: item.hours ?? 0,
      rate: item.rate ?? 0,
    })),
  };
}