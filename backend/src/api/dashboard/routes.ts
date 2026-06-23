import { Router }
from "express";

import {
  dashboard
} from "./controller";

const router =
  Router();

router.get(
  "/:userId",
  dashboard
);

export default router;