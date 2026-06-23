import {
  Request,
  Response
} from "express";

import {
  generateRoadmap
} from "./service";

export async function roadmap(
  req: Request,
  res: Response
) {

  try {

    const {
      userId
    } = req.body;

    const result =
      await generateRoadmap(
        userId
      );

    res.json(result);

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      message:
        error.message
    });

  }
}