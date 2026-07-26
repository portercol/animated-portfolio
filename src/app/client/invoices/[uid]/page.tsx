import { notFound } from "next/navigation";

import { mapInvoice } from "@/lib/invoices";
import { createClient } from "@/prismicio";

import InvoiceHeader from "./InvoiceHeader";
import InvoiceItems from "./InvoiceItems";
import InvoiceSummary from "./InvoiceSummary";
import PaymentButton from "./PaymentButton";

interface InvoicePageProps {
  params: {
    uid: string;
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const client = createClient();

  const document = await client
    .getByUID("invoice", params.uid)
    .catch(() => null);

  if (!document) {
    notFound();
  }

  const invoice = mapInvoice(document);

  return (
    <section className="background-gradient min-h-screen px-5 py-16 text-slate-100 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-950/70 shadow-2xl backdrop-blur-xl">
          <InvoiceHeader
            invoiceNumber={invoice.invoiceNumber}
            projectTitle={invoice.projectTitle}
            clientName={invoice.clientName}
            issueDate={invoice.issueDate}
            dueDate={invoice.dueDate}
            status={invoice.status}
          />

          <InvoiceItems items={invoice.items} />
          <InvoiceSummary items={invoice.items} />

          <div className="border-t border-slate-800 px-6 py-6 sm:px-10">
            {invoice.status === "Outstanding" ? (
              <PaymentButton invoiceUid={invoice.uid} />
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-emerald-300">
                  This invoice has been paid.
                </p>

                <a
                  href={`/client/invoices/${invoice.uid}/pdf`}
                  className="inline-flex items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-400/15"
                >
                  Download PDF invoice
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
