import {
  Request,
  Response
} from "express";

import {
  getDashboard
} from "./service";

export async function dashboard(
  req: Request,
  res: Response
) {

  try {

    const {
      userId
    } = req.params;

    const result =
      await getDashboard(
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