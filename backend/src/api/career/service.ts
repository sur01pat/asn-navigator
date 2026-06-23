
import { db } from "../../services/firestore/firestore";
import { geminiModel } from "../../services/gemini/gemini";

export async function careerChat(
  userId: string,
  question: string
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

  const profile =
    profileSnapshot.empty
      ? {}
      : profileSnapshot.docs[0].data();

  // -------------------------
  // Assessment
  // -------------------------

  const assessmentSnapshot =
    await db
      .collection("skill_assessments")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

  const assessment =
    assessmentSnapshot.empty
      ? {}
      : assessmentSnapshot.docs[0].data();

  // -------------------------
  // Skill Gap
  // -------------------------

  const gapSnapshot =
    await db
      .collection("skill_gap_analysis")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

  const skillGap =
    gapSnapshot.empty
      ? {}
      : gapSnapshot.docs[0].data();

  // -------------------------
  // Learning Path
  // -------------------------

  const roadmapSnapshot =
    await db
      .collection("learning_paths")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

  const roadmap =
    roadmapSnapshot.empty
      ? {}
      : roadmapSnapshot.docs[0].data();

  // -------------------------
  // Portfolio Projects
  // -------------------------

  const projectSnapshot =
    await db
      .collection("portfolio_projects")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

  const projects =
    projectSnapshot.empty
      ? {}
      : projectSnapshot.docs[0].data();

  // -------------------------
  // Readiness Score
  // -------------------------

const currentSkills =
  assessment?.skills || [];

  const missingSkills =
    skillGap.missingSkills || [];

  const readinessScore =
    currentSkills.length +
      missingSkills.length === 0
      ? 0
      : Math.round(
          (
            currentSkills.length /
            (
              currentSkills.length +
              missingSkills.length
            )
          ) * 100
        );

  // -------------------------
  // Gemini Prompt
  // -------------------------

  const prompt = `
You are ASN Career Coach.

Current Role:
${profile.currentRole || "Unknown"}

Target Role:
${profile.targetRole || "Unknown"}

Experience Years:
${assessment.experienceYears || 0}

Current Skills:
${JSON.stringify(currentSkills)}

Missing Skills:
${JSON.stringify(missingSkills)}

Priority Skills:
${JSON.stringify(
  skillGap.prioritySkills || []
)}

Current Readiness Score:
${readinessScore}%

Learning Roadmap:
${JSON.stringify(roadmap)}

Portfolio Projects:
${JSON.stringify(projects)}

User Question:
${question}

Answer specifically for THIS user.

Return ONLY valid JSON.

{
  "answer":"",
  "readinessScore":0,
  "recommendation":"",
  "nextAction":"",
  "estimatedTimeline":""
}
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

  try {

    const result =
      JSON.parse(cleaned);

    return {
      answer:
        result.answer || "",
      readinessScore:
        result.readinessScore ||
        readinessScore,
      recommendation:
        result.recommendation || "",
      nextAction:
        result.nextAction || "",
      estimatedTimeline:
        result.estimatedTimeline || ""
    };

  } catch (error) {

    console.error(
      "Career coach parse failed",
      error
    );

    return {
      answer:
        "Unable to generate AI response. Based on your profile, continue focusing on the highest priority skills and follow your learning roadmap.",
      readinessScore:
        readinessScore,
      recommendation:
        "Complete the next milestone in your roadmap.",
      nextAction:
        "Start with the highest ranked missing skill.",
      estimatedTimeline:
        "4-6 months"
    };

  }

}
