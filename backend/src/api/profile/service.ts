import { db } from "../../services/firestore/firestore";

const profilesCollection = db.collection("profiles");

export async function createProfile(data: any) {

  const docRef = await profilesCollection.add({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return {
    id: docRef.id,
    ...data
  };
}

export async function getProfile(userId: string) {

  const snapshot = await profilesCollection
    .where("userId", "==", userId)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data()
  };
}

export async function updateProfile(
  userId: string,
  data: any
) {

  const snapshot = await profilesCollection
    .where("userId", "==", userId)
    .get();

  if (snapshot.empty) {
    throw new Error("Profile not found");
  }

  const doc = snapshot.docs[0];

  await doc.ref.update({
    ...data,
    updatedAt: new Date().toISOString()
  });

  return {
    success: true
  };
}