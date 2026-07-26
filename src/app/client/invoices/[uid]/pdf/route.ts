import { renderToBuffer } from "@react-pdf/renderer";
import { stripe } from "@/lib/stripe";
import { mapInvoice } from "@/lib/invoices";
import { createClient } from "@/prismicio";

import InvoicePdfDocument from "../InvoicePdfDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface InvoicePdfRouteContext {
    params: {
        uid: string;
    };
}

function sanitizeFilename(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function GET(
    request: Request,
    { params }: InvoicePdfRouteContext,
) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    const client = createClient();

    const document = await client
        .getByUID("invoice", params.uid)
        .catch(() => null);

    if (!document) {
        return Response.json({ error: "Invoice not found." }, { status: 404 });
    }

    const invoice = mapInvoice(document);

    let canDownloadPdf = invoice.status === "Paid";

    if (!canDownloadPdf && sessionId) {
        const session = await stripe.checkout.sessions
            .retrieve(sessionId)
            .catch(() => null);

        const belongsToInvoice =
            session?.metadata?.invoiceUid === params.uid;

        canDownloadPdf =
            !!session &&
            session.status === "complete" &&
            session.payment_status === "paid" &&
            belongsToInvoice;
    }

    if (!canDownloadPdf) {
        return Response.json(
            {
                error: "This invoice must be paid before its PDF can be downloaded.",
            },
            { status: 403 },
        );
    }

    const pdfDocument = InvoicePdfDocument({ invoice });

    const pdfBuffer = await renderToBuffer(pdfDocument);

    const pdfBytes = new Uint8Array(pdfBuffer);

    const filenameBase =
        sanitizeFilename(invoice.invoiceNumber) ||
        sanitizeFilename(invoice.uid) ||
        "invoice";

    return new Response(pdfBytes, {
        status: 200,

        headers: {
            "Content-Type": "application/pdf",

            "Content-Disposition": `attachment; filename="${filenameBase}-paid.pdf"`,

            "Content-Length": pdfBytes.byteLength.toString(),

            "Cache-Control": "private, no-store",
        },
    });
}
