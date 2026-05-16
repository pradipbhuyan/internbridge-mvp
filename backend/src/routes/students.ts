import { Router } from "express";
import { CityTier, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const studentsRouter = Router();

studentsRouter.post("/profile", requireAuth, requireRole(Role.STUDENT), async (req, res) => {
  const schema = z.object({
    collegeName: z.string(),
    degree: z.string(),
    graduationYear: z.number().int(),
    city: z.string(),
    cityTier: z.nativeEnum(CityTier),
    skills: z.array(z.string()).default([]),
    resumeUrl: z.string().url().optional()
  });

  const data = schema.parse(req.body);
  const profile = await prisma.studentProfile.upsert({
    where: { userId: req.auth!.userId },
    update: data,
    create: { ...data, userId: req.auth!.userId }
  });

  res.status(201).json(profile);
});

studentsRouter.post("/projects", requireAuth, requireRole(Role.STUDENT), async (req, res) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    link: z.string().url().optional()
  });

  const student = await prisma.studentProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!student) return res.status(400).json({ error: "Create student profile first" });

  const project = await prisma.project.create({
    data: { ...schema.parse(req.body), studentId: student.id }
  });

  res.status(201).json(project);
});

studentsRouter.get("/me", requireAuth, requireRole(Role.STUDENT), async (req, res) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: req.auth!.userId },
    include: { projects: true, applications: { include: { internship: true } } }
  });
  res.json(profile);
});
