import { Router } from "express";
import multer from "multer";

import { upload }
from "./controller";

const router = Router();

const uploadMiddleware =
  multer({
    storage: multer.memoryStorage()
  });

router.post(
  "/upload",
  uploadMiddleware.single("resume"),
  upload
);

export default router;