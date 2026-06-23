import {
  Request,
  Response
} from "express";

import {
  generateProjects
} from "./service";

export async function generate(
  req: Request,
  res: Response
) {

  try {

    const {
      userId
    } = req.body;

    const result =
      await generateProjects(
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