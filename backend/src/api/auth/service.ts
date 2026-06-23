import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { usersCollection } from "../../services/firestore/firestore";
import { env } from "../../config/env";

export async function signupUser(
  name: string,
  email: string,
  password: string
) {
  const existing = await usersCollection.where("email", "==", email).get();

  if (!existing.empty) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const docRef = await usersCollection.add({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  });

  return {
    id: docRef.id,
    name,
    email,
  };
}

export async function loginUser(
  email: string,
  password: string
) {
  const snapshot = await usersCollection.where("email", "==", email).get();

  if (snapshot.empty) {
    throw new Error("Invalid credentials");
  }

  const user = snapshot.docs[0].data();

  const valid = await bcrypt.compare(
    password,
    user.password
  );

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      email,
    },
    env.jwtSecret,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    email,
    name: user.name,
  };
}