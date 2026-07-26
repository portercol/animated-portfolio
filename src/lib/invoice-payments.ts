import "server-only";

import {
  createMigration,
  prismicWriteClient,
} from "@/lib/prismic-write";

interface MarkInvoicePaidOptions {
  invoiceUid: string;
  stripeSessionId: string;
}

export async function markInvoicePaid({
  invoiceUid,
  stripeSessionId,
}: MarkInvoicePaidOptions): Promise<void> {
  const document = await prismicWriteClient.getByUID(
    "invoice",
    invoiceUid,
  );

  if (document.data.status === "Paid") {
    console.log(
      `Invoice ${invoiceUid} is already marked as paid.`,
    );

    return;
  }

  const updatedDocument = {
    ...document,
    data: {
      ...document.data,
      status: "Paid" as const,
    },
  };

  const migration = createMigration();

  migration.updateDocument(
    updatedDocument,
    `Mark invoice ${invoiceUid} as paid`,
  );

  await prismicWriteClient.migrate(migration, {
    reporter(event) {
      console.log(
        `[Prismic payment update: ${stripeSessionId}]`,
        event,
      );
    },
  });
}