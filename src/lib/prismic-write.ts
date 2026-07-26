import "server-only";

import {
  createMigration,
  createWriteClient,
} from "@prismicio/client";

import config from "../../slicemachine.config.json";

const writeToken = process.env.PRISMIC_WRITE_TOKEN;

if (!writeToken) {
  throw new Error(
    "Missing PRISMIC_WRITE_TOKEN environment variable.",
  );
}

export const prismicWriteClient = createWriteClient(
  config.repositoryName,
  {
    writeToken,
  },
);

export { createMigration };