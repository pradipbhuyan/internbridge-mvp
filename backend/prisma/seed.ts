import { PrismaClient, Role, CityTier, InternshipMode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123", 10);

  const employerUser = await prisma.user.upsert({
    where: { email: "hr@acme.in" },
    update: {},
    create: { name: "ACME HR", email: "hr@acme.in", role: Role.EMPLOYER, passwordHash }
  });

  const employer = await prisma.employerProfile.upsert({
    where: { userId: employerUser.id },
    update: {},
    create: {
      userId: employerUser.id,
      companyName: "ACME Digital Services",
      industry: "IT Services",
      city: "Bhubaneswar",
      cityTier: CityTier.TIER_2,
      website: "https://example.com"
    }
  });

  await prisma.internship.createMany({
    data: [
      {
        employerId: employer.id,
        title: "Frontend Developer Intern",
        description: "Build React UI screens for SME clients.",
        domain: "Software Development",
        skillsRequired: ["React", "JavaScript", "HTML", "CSS"],
        city: "Bhubaneswar",
        cityTier: CityTier.TIER_2,
        mode: InternshipMode.HYBRID,
        durationWeeks: 8,
        stipendMonthly: 8000
      },
      {
        employerId: employer.id,
        title: "Digital Marketing Intern",
        description: "Support social media campaigns and analytics.",
        domain: "Marketing",
        skillsRequired: ["SEO", "Canva", "Instagram"],
        city: "Cuttack",
        cityTier: CityTier.TIER_3,
        mode: InternshipMode.REMOTE,
        durationWeeks: 6,
        stipendMonthly: 5000
      }
    ],
    skipDuplicates: true
  });

  console.log("Seed data created. Test employer login: hr@acme.in / Password123");
}

main().finally(() => prisma.$disconnect());
