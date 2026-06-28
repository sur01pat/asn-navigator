import express from "express";
import cors from "cors";

import authRoutes from "./api/auth/routes";
import profileRoutes from "./api/profile/routes";
import resumeRoutes from "./api/resume/routes";
import assessmentRoutes from "./api/assessment/routes";
import skillsRoutes from "./api/skills/routes";
import learningRoutes from "./api/learning/routes";
import projectsRoutes from "./api/projects/routes";

import dashboardRoutes from "./api/dashboard/routes";
import careerRoutes from "./api/career/routes";
import projectProgressRoutes from "./api/project-progress/routes";

const app = express();

app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());
app.use(
  "/api/profile",
  profileRoutes
);
app.use(
  "/api/resume",
  resumeRoutes
);
app.use(
  "/api/assessment",
  assessmentRoutes
);
app.use(
  "/api/skills",
  skillsRoutes
);
app.use(
  "/api/learning",
  learningRoutes
);
app.use(
  "/api/projects",
  projectsRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/career",
  careerRoutes
);
app.use(
  "/api/project-progress",
  projectProgressRoutes
);
app.get("/health", (_, res) => {
  res.json({
    status: "UP",
    service: "ASN Backend",
    version: "1.0",
  });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `ASN Backend running on port ${PORT}`
  );
});