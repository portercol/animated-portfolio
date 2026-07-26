import "server-only";

import {
  createMigration,
  prismicWriteClient,
} from "@/lib/prismic-write";

import config from "../../slicemachine.config.json";

interface MarkInvoicePaidOptions {
  invoiceUid: string;
  stripeSessionId: string;
}

export async function markInvoicePaid({
  invoiceUid,
  stripeSessionId,
}: MarkInvoicePaidOptions): Promise<void> {
  console.log("Starting Prismic invoice update", {
    invoiceUid,
    stripeSessionId,
    repositoryName: config.repositoryName,
  });

  const document = await prismicWriteClient.getByUID(
    "invoice",
    invoiceUid,
  );

  console.log("Found Prismic invoice", {
    id: document.id,
    uid: document.uid,
    status: document.data.status,
    repositoryName: config.repositoryName,
  });

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

  console.log("Submitting Prismic migration", {
    invoiceUid,
    documentId: document.id,
  });

  const result = await prismicWriteClient.migrate(migration, {
    reporter(event) {
      console.log(
        `[Prismic payment update: ${stripeSessionId}]`,
        JSON.stringify(event),
      );
    },
  });

  console.log("Prismic migration finished", {
    invoiceUid,
    stripeSessionId,
    result,
  });
}