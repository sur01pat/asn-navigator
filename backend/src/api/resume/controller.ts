import { Request, Response } from "express";

import { uploadResume }
from "./service";

export async function upload(
  req: Request,
  res: Response
) {

  try {

    const userId =
      req.body.userId;

    const file =
      req.file!;

    const result =
      await uploadResume(
        file,
        userId
      );

    res.status(201).json(result);

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }
}