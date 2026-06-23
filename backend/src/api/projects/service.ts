import { db } from "../../services/firestore/firestore";
import { geminiModel } from "../../services/gemini/gemini";

export async function generateProjects(
  userId: string
) {

  // -------------------------
  // Profile
  // -------------------------

  const profileSnapshot =
    await db
      .collection("profiles")
      .where("userId", "==", userId)
      .limit(1)
      .get();

  if (profileSnapshot.empty) {
    throw new Error(
      "Profile not found"
    );
  }

  const profile =
    profileSnapshot.docs[0].data();

  // -------------------------
  // Skill Gap Analysis
  // -------------------------

  const gapSnapshot =
    await db
      .collection("skill_gap_analysis")
      .where("userId", "==", userId)
      .limit(1)
      .get();

  if (gapSnapshot.empty) {
    throw new Error(
      "Skill gap analysis not found"
    );
  }

  const gap =
    gapSnapshot.docs[0].data();

  const prompt = `
You are an expert AI Architect mentor.

Target Role:
${profile.targetRole}

Priority Skills:
${JSON.stringify(
  gap.prioritySkills || []
)}

Generate 5 portfolio projects.

Return ONLY valid JSON.

{
  "projects":[
    {
      "name":"",
      "difficulty":"",
      "durationWeeks":0,
      "description":"",
      "skills":[],
      "architecture":[]
    }
  ]
}

Rules:
- Projects should progressively increase in complexity
- Must be suitable for GitHub portfolio
- Must help land a job in the target role
- Focus on hands-on implementation
`;

  const response =
    await geminiModel.generateContent(
      prompt
    );

  const text =
    response.response
      .candidates?.[0]
      ?.content?.parts?.[0]
      ?.text || "{}";

  const cleaned =
    text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  const generated =
    JSON.parse(cleaned);

  const result = {
    userId,
    targetRole:
      profile.targetRole,
    projects:
      generated.projects || []
  };

  await db
    .collection("portfolio_projects")
    .add({
      ...result,
      createdAt:
        new Date().toISOString()
    });

  return result;
}