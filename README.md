# InternBridge India — Phase 1 MVP

Backend MVP for an undergraduate internship marketplace focused on Tier 1, Tier 2 and Tier 3 Indian cities.

## Phase 1 stories covered

- Student registration and login
- Employer registration and login
- Student profile creation
- Student project/skill showcase
- Employer profile creation
- Internship posting
- Internship search by city, tier, mode, domain, and skill
- One-click internship application
- Employer applicant list

## Tech stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication

## Local setup

```bash
cd backend
cp .env.example .env
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

API runs on:

```text
http://localhost:4000
```

## Useful test credentials

```text
Employer:
email: hr@acme.in
password: Password123
```

## API examples

### Register student

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Asha Kumar",
    "email": "asha@example.com",
    "password": "Password123",
    "role": "STUDENT"
  }'
```

### Register employer

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Recruiter",
    "email": "recruiter@example.com",
    "password": "Password123",
    "role": "EMPLOYER"
  }'
```

### Search internships

```bash
curl "http://localhost:4000/internships?cityTier=TIER_2&skill=React"
```

## Suggested GitHub commands

```bash
git init
git add .
git commit -m "Initial Phase 1 MVP backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/internbridge-mvp.git
git push -u origin main
```

## Next recommended build items

- React Native / Flutter mobile app
- File upload for resumes
- Email/WhatsApp alerts
- Skill tests and internship readiness score
- Admin dashboard for fraud prevention
