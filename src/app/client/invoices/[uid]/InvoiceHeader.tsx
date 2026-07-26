import type { InvoiceStatus } from "@/types/invoice";

interface InvoiceHeaderProps {
  invoiceNumber: string;
  projectTitle: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export default function InvoiceHeader({
  invoiceNumber,
  projectTitle,
  clientName,
  issueDate,
  dueDate,
  status,
}: InvoiceHeaderProps) {
  return (
    <header className="border-b border-slate-800 px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Client Invoice
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-100">
            {projectTitle}
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            {clientName}
          </p>
        </div>

        <div className="space-y-6 md:text-right">
          <div>
            <p className="text-sm text-slate-500">
              Invoice
            </p>

            <p className="font-medium">
              {invoiceNumber}
            </p>
          </div>

          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                status === "Paid"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <p className="text-slate-500">Issued</p>

              <p>{issueDate}</p>
            </div>

            <div>
              <p className="text-slate-500">Due</p>

              <p>{dueDate}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}