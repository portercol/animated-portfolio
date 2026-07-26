import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { markInvoicePaid } from "@/lib/invoice-payments";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "Missing STRIPE_WEBHOOK_SECRET environment variable.",
    );

    return NextResponse.json(
      { error: "Webhook configuration is missing." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error,
    );

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        if (session.payment_status !== "paid") {
          console.log(
            `Checkout Session ${session.id} is not paid yet.`,
          );

          break;
        }

        const invoiceUid = session.metadata?.invoiceUid;

        if (!invoiceUid) {
          console.error(
            `Checkout Session ${session.id} is missing invoiceUid metadata.`,
          );

          return NextResponse.json(
            { error: "Invoice metadata is missing." },
            { status: 400 },
          );
        }

        await markInvoicePaid({
          invoiceUid,
          stripeSessionId: session.id,
        });

        console.log(
          `Invoice ${invoiceUid} processed from Stripe Session ${session.id}.`,
        );

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event type: ${event.type}`,
        );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      `Failed to process Stripe event ${event.id}:`,
      error,
    );

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}