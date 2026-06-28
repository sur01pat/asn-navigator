import {
  Request,
  Response
} from "express";

import {
  startProject,
  getProjectProgress
} from "./service";

export async function start(
  req: Request,
  res: Response
) {
  try {
    const result =
      await startProject(
        req.body.userId,
        req.body.projectId,
        req.body.projectName
      );

    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      message: err.message
    });
  }
}

export async function get(
  req: Request,
  res: Response
) {
  try {
    const result =
      await getProjectProgress(
        req.params.userId
      );

    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      message: err.message
    });
  }
}