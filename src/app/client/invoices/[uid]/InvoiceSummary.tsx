import type { InvoiceItem } from "@/types/invoice";

interface InvoiceSummaryProps {
  items: InvoiceItem[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export default function InvoiceSummary({
  items,
}: InvoiceSummaryProps) {
  const subtotal = items.reduce(
    (total, item) => total + item.hours * item.rate,
    0,
  );

  return (
    <section className="border-t border-slate-800 px-6 py-8 sm:px-10">
      <div className="ml-auto max-w-sm">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-slate-800 pt-5">
          <div>
            <p className="text-sm text-slate-400">Total due</p>
            <p className="mt-1 text-xs text-slate-500">USD</p>
          </div>

          <p className="text-3xl font-semibold tracking-tight text-slate-100">
            {formatCurrency(subtotal)}
          </p>
        </div>
      </div>
    </section>
  );
}