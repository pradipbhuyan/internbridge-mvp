import { Router } from "express";
import { CityTier, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const employersRouter = Router();

employersRouter.post("/profile", requireAuth, requireRole(Role.EMPLOYER), async (req, res) => {
  const schema = z.object({
    companyName: z.string(),
    industry: z.string(),
    city: z.string(),
    cityTier: z.nativeEnum(CityTier),
    website: z.string().url().optional()
  });

  const data = schema.parse(req.body);
  const profile = await prisma.employerProfile.upsert({
    where: { userId: req.auth!.userId },
    update: data,
    create: { ...data, userId: req.auth!.userId }
  });

  res.status(201).json(profile);
});

employersRouter.get("/applicants", requireAuth, requireRole(Role.EMPLOYER), async (req, res) => {
  const employer = await prisma.employerProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!employer) return res.status(400).json({ error: "Create employer profile first" });

  const applications = await prisma.application.findMany({
    where: { internship: { employerId: employer.id } },
    include: {
      internship: true,
      student: { include: { user: { select: { name: true, email: true, phone: true } }, projects: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(applications);
});
