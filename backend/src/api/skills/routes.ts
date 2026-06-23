import { Router }
from "express";

import {
  analyze
} from "./controller";

const router =
  Router();

router.post(
  "/gap-analysis",
  analyze
);

export default router;