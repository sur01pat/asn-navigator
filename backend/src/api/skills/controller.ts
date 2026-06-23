import {
  Request,
  Response
} from "express";

import {
  gapAnalysis
} from "./service";

export async function analyze(
  req: Request,
  res: Response
) {

  try {

    const { userId } =
      req.body;

    const result =
      await gapAnalysis(
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