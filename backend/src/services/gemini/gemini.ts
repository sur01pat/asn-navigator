import { VertexAI } from "@google-cloud/vertexai";

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.VERTEX_LOCATION || "us-central1"
});

export const geminiModel =
  vertexAI.getGenerativeModel({
    model:
      process.env.GEMINI_MODEL ||
      "gemini-2.5-flash"
  });