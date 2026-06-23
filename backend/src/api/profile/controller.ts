import { Request, Response } from "express";

import {
  createProfile,
  getProfile,
  updateProfile
} from "./service";

export async function create(
  req: Request,
  res: Response
) {
  try {

    const result =
      await createProfile(req.body);

    res.status(201).json(result);

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }
}

export async function get(
  req: Request,
  res: Response
) {
  try {

    const profile =
      await getProfile(req.params.userId);

    if (!profile) {

      return res.status(404).json({
        message: "Profile not found"
      });

    }

    res.json(profile);

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }
}

export async function update(
  req: Request,
  res: Response
) {
  try {

    const result =
      await updateProfile(
        req.params.userId,
        req.body
      );

    res.json(result);

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }
}