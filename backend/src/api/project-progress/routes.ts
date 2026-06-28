import { Router } from "express";

import {
  start,
  get
} from "./controller";

const router =
  Router();

router.post(
  "/start",
  start
);

router.get(
  "/:userId",
  get
);

export default router;