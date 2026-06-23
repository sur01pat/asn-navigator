import { db } from "../../services/firestore/firestore";
import { geminiModel } from "../../services/gemini/gemini";

export async function analyzeResume(
  userId: string,
  resumeText: string
) {

  const prompt = `
Analyze the resume.

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

  const result =
    await geminiModel.generateContent(
      prompt
    );

  const text =
    result.response.candidates?.[0]
      ?.content?.parts?.[0]
      ?.text || "{}";

  const cleaned =
    text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  const assessment =
    JSON.parse(cleaned);

  const docRef =
    await db
      .collection("skill_assessments")
      .add({
        userId,
        ...assessment,
        createdAt:
          new Date().toISOString()
      });

  return {
    id: docRef.id,
    ...assessment
  };
}