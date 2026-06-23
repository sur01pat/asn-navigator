import { Request, Response } from "express";

import {
  signupUser,
  loginUser,
} from "./service";

export async function signup(
  req: Request,
  res: Response
) {
  try {
    const { name, email, password } = req.body;

    const user = await signupUser(
      name,
      email,
      password
    );

    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function login(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    const result = await loginUser(
      email,
      password
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(401).json({
      message: error.message,
    });
  }
}