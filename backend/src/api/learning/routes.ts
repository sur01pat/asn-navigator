import { Router }
from "express";

import {
  roadmap
} from "./controller";

const router =
  Router();

router.post(
  "/generate-roadmap",
  roadmap
);

export default router;