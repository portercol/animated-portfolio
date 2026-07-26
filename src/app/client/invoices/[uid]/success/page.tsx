import Link from "next/link";

import { stripe } from "@/lib/stripe";

interface InvoiceSuccessPageProps {
  params: {
    uid: string;
  };
  searchParams: {
    session_id?: string;
  };
}

function formatCurrency(amountInCents: number | null): string {
  if (amountInCents === null) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

export default async function InvoiceSuccessPage({
  params,
  searchParams,
}: InvoiceSuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <SuccessPageShell>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Payment status unavailable
          </p>

          <h1 className="mt-4 text-3xl font-bold text-white">
            We couldn&apos;t verify this payment
          </h1>

          <p className="mt-4 text-slate-300">
            The Checkout Session ID was missing. Return to the invoice and try
            again.
          </p>

          <Link
            href={`/client/invoices/${params.uid}`}
            className="mt-8 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Return to invoice
          </Link>
        </div>
      </SuccessPageShell>
    );
  }

  const session = await stripe.checkout.sessions
    .retrieve(sessionId)
    .catch(() => null);

  const belongsToInvoice =
    session?.metadata?.invoiceUid === params.uid;

  const paymentSucceeded =
    session?.status === "complete" &&
    session.payment_status === "paid" &&
    belongsToInvoice;

  if (!session || !paymentSucceeded) {
    return (
      <SuccessPageShell>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Payment not verified
          </p>

          <h1 className="mt-4 text-3xl font-bold text-white">
            We couldn&apos;t confirm your payment
          </h1>

          <p className="mt-4 text-slate-300">
            No charge has been confirmed for this invoice. Return to the
            invoice to review its payment status.
          </p>

          <Link
            href={`/client/invoices/${params.uid}`}
            className="mt-8 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Return to invoice
          </Link>
        </div>
      </SuccessPageShell>
    );
  }

  const invoiceNumber =
    session.metadata?.invoiceNumber ?? params.uid;

  const customerEmail =
    session.customer_details?.email;

  const formattedTotal = formatCurrency(session.amount_total);

  return (
    <SuccessPageShell>
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-8 text-emerald-300"
          >
            <path
              d="m5 12.5 4.25 4.25L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Payment successful
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Thank you for your payment
        </h1>

        <p className="mt-4 text-slate-300">
          Your payment for invoice{" "}
          <span className="font-semibold text-white">
            {invoiceNumber}
          </span>{" "}
          has been confirmed.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 text-left">
          <dl className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-400">Invoice</dt>
              <dd className="font-medium text-slate-100">
                {invoiceNumber}
              </dd>
            </div>

            {formattedTotal ? (
              <div className="flex items-center justify-between gap-4 border-t border-slate-800 pt-4">
                <dt className="text-sm text-slate-400">Amount paid</dt>
                <dd className="text-lg font-semibold text-white">
                  {formattedTotal}
                </dd>
              </div>
            ) : null}

            {customerEmail ? (
              <div className="flex items-start justify-between gap-4 border-t border-slate-800 pt-4">
                <dt className="text-sm text-slate-400">
                  Confirmation email
                </dt>
                <dd className="max-w-[65%] break-words text-right text-sm font-medium text-slate-100">
                  {customerEmail}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <Link
          href={`/client/invoices/${params.uid}`}
          className="mt-8 inline-flex rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-300"
        >
          Return to invoice
        </Link>
      </div>
    </SuccessPageShell>
  );
}

interface SuccessPageShellProps {
  children: React.ReactNode;
}

function SuccessPageShell({
  children,
}: SuccessPageShellProps) {
  return (
    <section className="background-gradient flex min-h-screen items-center px-5 py-16 text-slate-100 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-950/70 px-6 py-12 shadow-2xl backdrop-blur-xl sm:px-12">
          {children}
        </div>
      </div>
    </section>
  );
}