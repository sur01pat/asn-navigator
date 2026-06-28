import { db } from "../../services/firestore/firestore";

export async function startProject(
  userId: string,
  projectId: number,
  projectName: string
) {
  const snapshot =
    await db
      .collection("project_progress")
      .where("userId", "==", userId)
      .where("projectId", "==", projectId)
      .limit(1)
      .get();

  if (snapshot.empty) {
    await db
      .collection("project_progress")
      .add({
        userId,
        projectId,
        projectName,
        progress: 0,
        status: "In Progress",
        startedAt:
          new Date().toISOString()
      });
  }

  return {
    success: true
  };
}

export async function getProjectProgress(
  userId: string
) {
  const snapshot =
    await db
      .collection("project_progress")
      .where("userId", "==", userId)
      .get();

  return snapshot.docs.map(
    (doc) => doc.data()
  );
}