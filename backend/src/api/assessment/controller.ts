import { Request, Response }
from "express";

import {
  analyzeResume
} from "./service";

export async function analyze(
  req: Request,
  res: Response
) {

  try {

    const {
      userId,
      resumeText
    } = req.body;

    const result =
      await analyzeResume(
        userId,
        resumeText
      );

    res.json(result);

  } catch (error: any) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
}