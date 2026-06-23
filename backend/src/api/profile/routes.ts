import { Router } from "express";

import {
  create,
  get,
  update
} from "./controller";

const router = Router();

router.post("/", create);

router.get("/:userId", get);

router.put("/:userId", update);

export default router;