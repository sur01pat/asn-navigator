import { db } from "../../services/firestore/firestore";
import { geminiModel } from "../../services/gemini/gemini";

export async function generateRoadmap(
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

let profile = {
  targetRole:
    "Agentic AI Architect",
  learningHoursPerWeek: 10,
};

if (profileSnapshot.empty) {

  console.log(
    "Profile not found. Using defaults."
  );

} else {

  const savedProfile =
    profileSnapshot.docs[0].data();

  profile = {
    targetRole:
      savedProfile?.targetRole ||
      "Agentic AI Architect",

    learningHoursPerWeek:
      savedProfile?.learningHoursPerWeek ||
      10,
  };
}

console.log(
  "Roadmap Profile:",
  profile
);



  // -------------------------
  // Latest Skill Gap
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
You are an expert AI career coach.

Target Role:
${profile.targetRole}

Learning Hours Per Week:
${profile.learningHoursPerWeek || 10}

Priority Skills:
${JSON.stringify(
  gap.prioritySkills || []
)}

Create a realistic learning roadmap.

Return ONLY valid JSON.

{
  "30Days": {
    "title":"",
    "activities":[]
  },

  "60Days": {
    "title":"",
    "activities":[]
  },

  "90Days": {
    "title":"",
    "activities":[]
  },

  "recommendedCourses":[
    {
      "name":"",
      "platform":"",
      "url":""
    }
  ],

  "recommendedProjects":[
    {
      "name":"",
      "description":"",
      "skills":[]
    }
  ]
}

Rules:
- Practical roadmap
- Beginner to advanced
- Focus on career ROI
- Include hands-on projects
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

  const roadmap =
    JSON.parse(cleaned);

  const result = {
    userId,
    targetRole:
      profile.targetRole,
    ...roadmap
  };

  await db
    .collection("learning_paths")
    .add({
      ...result,
      createdAt:
        new Date().toISOString()
    });

  return result;
}