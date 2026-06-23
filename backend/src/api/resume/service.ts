import { bucket } from "../../services/storage/storage";
import { db } from "../../services/firestore/firestore";

export async function uploadResume(
  file: Express.Multer.File,
  userId: string
) {

  const fileName =
    `${userId}-${Date.now()}-${file.originalname}`;

  const blob = bucket.file(fileName);

  await blob.save(file.buffer);

  const gcsPath =
    `gs://${bucket.name}/${fileName}`;

  const docRef =
    await db.collection("resumes").add({
      userId,
      fileName,
      gcsPath,
      uploadedAt:
        new Date().toISOString()
    });

  return {
    id: docRef.id,
    gcsPath
  };
}