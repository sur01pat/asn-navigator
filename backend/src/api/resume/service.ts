
import { bucket } from "../../services/storage/storage";
import { db } from "../../services/firestore/firestore";
import { geminiModel } from "../../services/gemini/gemini";

import { gapAnalysis } from "../skills/service";
import { generateRoadmap } from "../learning/service";
import { generateProjects } from "../projects/service";

const pdfParse = require("pdf-parse");

export async function uploadResume(
  file: Express.Multer.File,
  userId: string
) {
  try {

    if (!file || !file.buffer) {
      throw new Error(
        "Resume file not found"
      );
    }

    console.log("========== FILE INFO ==========");
    console.log(
      "Name:",
      file.originalname
    );
    console.log(
      "Size:",
      file.size
    );
    console.log(
      "Buffer:",
      file.buffer.length
    );
    console.log("===============================");

    // Upload to GCS

    const fileName =
      `${userId}-${Date.now()}-${file.originalname}`;

    const blob =
      bucket.file(fileName);

    await blob.save(file.buffer);

    const gcsPath =
      `gs://${bucket.name}/${fileName}`;

    const resumeDoc =
      await db.collection("resumes").add({
        userId,
        fileName,
        gcsPath,
        uploadedAt:
          new Date().toISOString()
      });

    console.log(
      "Resume uploaded to GCS"
    );

    // Parse PDF

    console.log(
      "Parsing PDF..."
    );

    const pdf =
      await pdfParse(file.buffer);

    const resumeText =
      pdf?.text || "";

    console.log(
      "PDF parsed"
    );

    console.log(
      "Resume text length:",
      resumeText.length
    );

    if (!resumeText.trim()) {
      throw new Error(
        "Unable to extract text from PDF"
      );
    }

    // Gemini Analysis

    console.log(
      "Calling Gemini..."
    );

    const prompt = `
You are an expert resume analyzer.

Analyze this resume.

Return ONLY valid JSON.

{
  "currentRole":"",
  "experienceYears":0,
  "skills":[],
  "certifications":[],
  "education":[]
}

Resume:

${resumeText}
`;

    const response =
      await geminiModel.generateContent(
        prompt
      );

    const text =
      response.response
        ?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text || "{}";

    const cleaned =
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    console.log(
      "Gemini Response:"
    );

    console.log(cleaned);

    let assessment;

    try {

      assessment =
        JSON.parse(cleaned);

    } catch (error) {

      console.error(
        "Invalid Gemini JSON"
      );

      console.error(cleaned);

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    // Save Assessment

    await db
      .collection("skill_assessments")
      .add({
        userId,
        ...assessment,
        createdAt:
          new Date().toISOString()
      });

    console.log(
      "Assessment Saved"
    );

    // ASN Pipeline

    console.log(
      "Running Gap Analysis..."
    );

    await gapAnalysis(userId);

    console.log(
      "Generating Roadmap..."
    );

    await generateRoadmap(userId);

    console.log(
      "Generating Projects..."
    );

    await generateProjects(userId);

    console.log(
      "ASN Pipeline Completed"
    );

    return {
      success: true,
      resumeId: resumeDoc.id,
      gcsPath,
      assessment
    };

  } catch (error: any) {

    console.error(
      "Resume Processing Failed"
    );

    console.error(error);

    throw error;
  }
}
