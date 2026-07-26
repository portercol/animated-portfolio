import { NextResponse } from "next/server";

import { mapInvoice } from "@/lib/invoices";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/prismicio";

interface CheckoutRequestBody {
  invoiceUid?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequestBody;
    const invoiceUid = body.invoiceUid?.trim();

    if (!invoiceUid) {
      return NextResponse.json(
        { error: "Invoice UID is required." },
        { status: 400 },
      );
    }

    const client = createClient();

    const document = await client
      .getByUID("invoice", invoiceUid)
      .catch(() => null);

    if (!document) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 },
      );
    }

    const invoice = mapInvoice(document);

    if (invoice.status === "Paid") {
      return NextResponse.json(
        { error: "This invoice has already been paid." },
        { status: 409 },
      );
    }

    const totalInCents = Math.round(
      invoice.items.reduce((total, item) => {
        return total + item.hours * item.rate;
      }, 0) * 100,
    );

    if (totalInCents <= 0) {
      return NextResponse.json(
        { error: "Invoice total must be greater than $0." },
        { status: 400 },
      );
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: totalInCents,
            product_data: {
              name: `Invoice ${invoice.invoiceNumber}`,
              description: invoice.projectTitle,
            },
          },
        },
      ],

      metadata: {
        invoiceUid: invoice.uid,
        invoiceNumber: invoice.invoiceNumber,
      },

      payment_intent_data: {
        metadata: {
          invoiceUid: invoice.uid,
          invoiceNumber: invoice.invoiceNumber,
        },
      },

      success_url: `${origin}/client/invoices/${invoice.uid}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/client/invoices/${invoice.uid}`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a Checkout URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Failed to create Stripe Checkout Session:", error);

    return NextResponse.json(
      { error: "Unable to start payment. Please try again." },
      { status: 500 },
    );
  }
}