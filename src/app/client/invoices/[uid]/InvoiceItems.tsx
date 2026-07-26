import type { InvoiceItem } from "@/types/invoice";

interface InvoiceItemsProps {
  items: InvoiceItem[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export default function InvoiceItems({
  items,
}: InvoiceItemsProps) {
  return (
    <section className="px-6 py-10 sm:px-10">
      <h2 className="text-lg font-semibold text-slate-100">
        Services
      </h2>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <div className="hidden grid-cols-[1fr_90px_110px_120px] gap-4 border-b border-slate-800 bg-slate-900/80 px-5 py-3 text-sm text-slate-400 sm:grid">
          <span>Description</span>
          <span className="text-right">Hours</span>
          <span className="text-right">Rate</span>
          <span className="text-right">Amount</span>
        </div>

        <div className="divide-y divide-slate-800">
          {items.map((item) => {
            const amount = item.hours * item.rate;

            return (
              <div
                key={item.description}
                className="grid gap-3 px-5 py-5 sm:grid-cols-[1fr_90px_110px_120px] sm:items-center sm:gap-4"
              >
                <p className="font-medium text-slate-100">
                  {item.description}
                </p>

                <div className="flex justify-between text-sm sm:block sm:text-right">
                  <span className="text-slate-500 sm:hidden">
                    Hours
                  </span>

                  <span className="text-slate-300">
                    {item.hours}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:block sm:text-right">
                  <span className="text-slate-500 sm:hidden">
                    Rate
                  </span>

                  <span className="text-slate-300">
                    {formatCurrency(item.rate)}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:block sm:text-right">
                  <span className="text-slate-500 sm:hidden">
                    Amount
                  </span>

                  <span className="font-medium text-slate-100">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}