import { Router }
from "express";

import {
  analyze
} from "./controller";

const router = Router();

router.post(
  "/analyze",
  analyze
);

export default router;