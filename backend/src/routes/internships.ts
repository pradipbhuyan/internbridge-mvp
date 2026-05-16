import { Router } from "express";
import { CityTier, InternshipMode, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const internshipsRouter = Router();

internshipsRouter.post("/", requireAuth, requireRole(Role.EMPLOYER), async (req, res) => {
  const schema = z.object({
    title: z.string(),
    description: z.string(),
    domain: z.string(),
    skillsRequired: z.array(z.string()).default([]),
    city: z.string(),
    cityTier: z.nativeEnum(CityTier),
    mode: z.nativeEnum(InternshipMode),
    durationWeeks: z.number().int().positive(),
    stipendMonthly: z.number().int().nonnegative().optional()
  });

  const employer = await prisma.employerProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!employer) return res.status(400).json({ error: "Create employer profile first" });

  const internship = await prisma.internship.create({
    data: { ...schema.parse(req.body), employerId: employer.id }
  });

  res.status(201).json(internship);
});

internshipsRouter.get("/", async (req, res) => {
  const { city, cityTier, domain, mode, skill } = req.query;

  const internships = await prisma.internship.findMany({
    where: {
      isActive: true,
      city: city ? String(city) : undefined,
      cityTier: cityTier ? (String(cityTier) as CityTier) : undefined,
      domain: domain ? { contains: String(domain), mode: "insensitive" } : undefined,
      mode: mode ? (String(mode) as InternshipMode) : undefined,
      skillsRequired: skill ? { has: String(skill) } : undefined
    },
    include: { employer: true },
    orderBy: { createdAt: "desc" }
  });

  res.json(internships);
});

internshipsRouter.post("/:id/apply", requireAuth, requireRole(Role.STUDENT), async (req, res) => {
  const schema = z.object({ coverNote: z.string().optional() });
  const student = await prisma.studentProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!student) return res.status(400).json({ error: "Create student profile first" });

  try {
    const application = await prisma.application.create({
      data: {
        internshipId: req.params.id,
        studentId: student.id,
        coverNote: schema.parse(req.body).coverNote
      }
    });
    res.status(201).json(application);
  } catch {
    res.status(409).json({ error: "Already applied or invalid internship" });
  }
});
