// import fs from "fs";
// import path from "path";

// import { db } from "../../services/firestore/firestore";

// export async function gapAnalysis(
//   userId: string
// ) {

//   // profile

//   const profileSnapshot =
//     await db
//       .collection("profiles")
//       .where("userId", "==", userId)
//       .get();

//   if (profileSnapshot.empty) {
//     throw new Error("Profile not found");
//   }

//   const profile =
//     profileSnapshot.docs[0].data();

//   const targetRole =
//     profile.targetRole;

//   // assessment

//   const assessmentSnapshot =
//     await db
//       .collection("skill_assessments")
//       .where("userId", "==", userId)
//       .orderBy("createdAt", "desc")
//       .limit(1)
//       .get();

//   if (assessmentSnapshot.empty) {
//     throw new Error(
//       "Assessment not found"
//     );
//   }

//   const assessment =
//     assessmentSnapshot.docs[0].data();

//   const currentSkills =
//     assessment.skills || [];

//   // market dataset

//   const datasetPath =
//     path.join(
//       process.cwd(),
//       "data",
//       "market-roles.json"
//     );

//   const marketRoles =
//     JSON.parse(
//       fs.readFileSync(
//         datasetPath,
//         "utf8"
//       )
//     );

//   const roleSkills =
//     marketRoles[targetRole] || [];
  
//     if (!roleSkills.length) {
//     throw new Error(
//         `Target role not found: ${targetRole}`
//     );
//     }

//   const currentLower =
//     currentSkills.map(
//       (s: string) => s.toLowerCase()
//     );

//   const missingSkills =
//     roleSkills.filter(
//       (skill: string) =>
//         !currentLower.includes(
//           skill.toLowerCase()
//         )
//     );

//   const result = {
//     userId,
//     targetRole,
//     currentSkills,
//     missingSkills,
//     prioritySkills:
//       missingSkills.slice(0, 3)
//   };

//   await db
//     .collection("skill_gap_analysis")
//     .add({
//       ...result,
//       createdAt:
//         new Date().toISOString()
//     });

//   return result;
// }

// import fs from "fs";
// import path from "path";

// import { db } from "../../services/firestore/firestore";
// import { geminiModel } from "../../services/gemini/gemini";

// async function getPrioritySkills(
//   targetRole: string,
//   currentSkills: string[],
//   missingSkills: string[]
// ): Promise<string[]> {

//   if (missingSkills.length === 0) {
//     return [];
//   }

//   const prompt = `
// You are an expert career advisor.

// Target Role:
// ${targetRole}

// Current Skills:
// ${JSON.stringify(currentSkills)}

// Missing Skills:
// ${JSON.stringify(missingSkills)}

// Rank the missing skills by:

// 1. Career impact
// 2. Market demand
// 3. Learning ROI
// 4. Relevance to the target role

// Return ONLY valid JSON.

// {
//   "prioritySkills":[]
// }
// `;

//   try {

//     const response =
//       await geminiModel.generateContent(
//         prompt
//       );

//     const text =
//       response.response
//         .candidates?.[0]
//         ?.content?.parts?.[0]
//         ?.text || "{}";

//     const cleaned =
//       text
//         .replace(/```json/g, "")
//         .replace(/```/g, "")
//         .trim();

//     const parsed =
//       JSON.parse(cleaned);

//     return parsed.prioritySkills || [];

//   } catch (error) {

//     console.error(
//       "Gemini prioritization failed",
//       error
//     );

//     return missingSkills.slice(0, 3);
//   }
// }

// export async function gapAnalysis(
//   userId: string
// ) {

//   // Profile

//   const profileSnapshot =
//     await db
//       .collection("profiles")
//       .where("userId", "==", userId)
//       .limit(1)
//       .get();

//   if (profileSnapshot.empty) {
//     throw new Error(
//       "Profile not found"
//     );
//   }

//   const profile =
//     profileSnapshot.docs[0].data();

//   const targetRole =
//     profile.targetRole;

//   // Assessment

//   const assessmentSnapshot =
//     await db
//       .collection("skill_assessments")
//       .where("userId", "==", userId)
//       .limit(1)
//       .get();

//   if (assessmentSnapshot.empty) {
//     throw new Error(
//       "Assessment not found"
//     );
//   }

//   const assessment =
//     assessmentSnapshot.docs[0].data();

//   const currentSkills =
//     assessment.skills || [];

//   // Market Role Dataset

//   const datasetPath =
//     path.join(
//       process.cwd(),
//       "data",
//       "market-roles.json"
//     );

//   const marketRoles =
//     JSON.parse(
//       fs.readFileSync(
//         datasetPath,
//         "utf8"
//       )
//     );

//   const roleSkills =
//     marketRoles[targetRole] || [];

//   if (!roleSkills.length) {

//     throw new Error(
//       `Target role not found: ${targetRole}`
//     );

//   }

//   // Skill Gap

//   const currentLower =
//     currentSkills.map(
//       (s: string) =>
//         s.toLowerCase()
//     );

//   const missingSkills =
//     roleSkills.filter(
//       (skill: string) =>
//         !currentLower.includes(
//           skill.toLowerCase()
//         )
//     );

//   // Gemini Prioritization

//   const prioritySkills =
//     await getPrioritySkills(
//       targetRole,
//       currentSkills,
//       missingSkills
//     );

//   const result = {
//     userId,
//     targetRole,
//     currentSkills,
//     missingSkills,
//     prioritySkills
//   };

//   await db
//     .collection("skill_gap_analysis")
//     .add({
//       ...result,
//       createdAt:
//         new Date().toISOString()
//     });

//   return result;
// }

import fs from "fs";
import path from "path";

import { db } from "../../services/firestore/firestore";
import { geminiModel } from "../../services/gemini/gemini";

async function getPrioritySkills(
  targetRole: string,
  currentSkills: string[],
  missingSkills: string[]
): Promise<string[]> {

  if (missingSkills.length === 0) {
    return [];
  }

  const prompt = `
You are an expert AI career advisor.

Target Role:
${targetRole}

Current Skills:
${JSON.stringify(currentSkills)}

Missing Skills:
${JSON.stringify(missingSkills)}

Rank the missing skills based on:

1. Career impact
2. Market demand
3. Learning ROI
4. Relevance to the target role

Return ONLY valid JSON.

{
  "prioritySkills":[
    "skill1",
    "skill2",
    "skill3"
  ]
}

Rules:
- Return only skill names.
- Do not return rankings.
- Do not return explanations.
- Do not return objects.
- Return skills in priority order.
`;

  try {

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

    const parsed =
      JSON.parse(cleaned);

    const prioritySkills =
      (parsed.prioritySkills || [])
        .map((item: any) => {

          if (typeof item === "string") {
            return item;
          }

          if (
            typeof item === "object" &&
            item.skillName
          ) {
            return item.skillName;
          }

          return null;
        })
        .filter(Boolean);

    return prioritySkills;

  } catch (error) {

    console.error(
      "Gemini prioritization failed",
      error
    );

    return missingSkills.slice(0, 3);
  }
}

export async function gapAnalysis(
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

  const targetRole =
    profile.targetRole;

  // -------------------------
  // Assessment
  // -------------------------

  const assessmentSnapshot =
    await db
      .collection("skill_assessments")
      .where("userId", "==", userId)
      .limit(1)
      .get();

  if (assessmentSnapshot.empty) {
    throw new Error(
      "Assessment not found"
    );
  }

  const assessment =
    assessmentSnapshot.docs[0].data();

  const currentSkills =
    assessment.skills || [];

  // -------------------------
  // Market Dataset
  // -------------------------

  const datasetPath =
    path.join(
      process.cwd(),
      "data",
      "market-roles.json"
    );

  const marketRoles =
    JSON.parse(
      fs.readFileSync(
        datasetPath,
        "utf8"
      )
    );

  const roleSkills =
    marketRoles[targetRole] || [];

  if (!roleSkills.length) {

    throw new Error(
      `Target role not found: ${targetRole}`
    );

  }

  // -------------------------
  // Skill Gap Analysis
  // -------------------------

  const currentLower =
    currentSkills.map(
      (s: string) =>
        s.toLowerCase()
    );

  const missingSkills =
    roleSkills.filter(
      (skill: string) =>
        !currentLower.includes(
          skill.toLowerCase()
        )
    );

  // -------------------------
  // Gemini Prioritization
  // -------------------------

  const prioritySkills =
    await getPrioritySkills(
      targetRole,
      currentSkills,
      missingSkills
    );

  // -------------------------
  // Result
  // -------------------------

  const result = {
    userId,
    targetRole,
    currentSkills,
    missingSkills,
    prioritySkills
  };

  // -------------------------
  // Save to Firestore
  // -------------------------

  await db
    .collection("skill_gap_analysis")
    .add({
      ...result,
      createdAt:
        new Date().toISOString()
    });

  return result;
}