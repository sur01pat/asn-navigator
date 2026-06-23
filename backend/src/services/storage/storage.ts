import { Storage } from "@google-cloud/storage";

export const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT
});

export const bucket =
  storage.bucket(process.env.GCS_BUCKET!);