import { Firestore } from "@google-cloud/firestore";

export const db = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
});

export const usersCollection = db.collection("users");