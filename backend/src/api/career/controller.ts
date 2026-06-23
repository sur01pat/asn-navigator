import {
  Request,
  Response
} from "express";

import {
  careerChat
} from "./service";

export async function chat(
  req: Request,
  res: Response
) {

  try {

    const {
      userId,
      question
    } = req.body;

    const result =
      await careerChat(
        userId,
        question
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