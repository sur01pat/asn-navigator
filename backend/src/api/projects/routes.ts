import { Router }
from "express";

import {
  generate
} from "./controller";

const router =
  Router();

router.post(
  "/generate",
  generate
);

export default router;