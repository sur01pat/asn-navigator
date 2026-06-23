import { db }
from "../../services/firestore/firestore";

import {
  calculateReadinessScore
} from "./readiness-score";


export async function getDashboard(
  userId: string
) {

  // Profile

  const profileSnapshot =
    await db
      .collection("profiles")
      .where("userId", "==", userId)
      .limit(1)
      .get();

  const profile =
    profileSnapshot.empty
      ? null
      : profileSnapshot.docs[0].data();

  // Assessment

  const assessmentSnapshot =
    await db
      .collection("skill_assessments")
      .where("userId", "==", userId)
      .limit(1)
      .get();

  const assessment =
    assessmentSnapshot.empty
      ? null
      : assessmentSnapshot.docs[0].data();

  // Skill Gap

  const gapSnapshot =
    await db
      .collection("skill_gap_analysis")
      .where("userId", "==", userId)
      .limit(1)
      .get();

  const skillGap =
    gapSnapshot.empty
      ? null
      : gapSnapshot.docs[0].data();

  // Roadmap

  const roadmapSnapshot =
    await db
      .collection("learning_paths")
      .where("userId", "==", userId)
      .limit(1)
      .get();

  const roadmap =
    roadmapSnapshot.empty
      ? null
      : roadmapSnapshot.docs[0].data();

  // Projects

  const projectSnapshot =
    await db
      .collection("portfolio_projects")
      .where("userId", "==", userId)
      .limit(1)
      .get();

  const projects =
    projectSnapshot.empty
      ? null
      : projectSnapshot.docs[0].data();

  
const currentSkills =
  assessment?.skills || [];

const missingSkills =
  skillGap?.missingSkills || [];

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



 
return {
  profile: profile || {},
  assessment: assessment || {},
  skillGap: skillGap || {},
  roadmap: roadmap || {},
  projects: projects || {},
  readinessScore
};


}