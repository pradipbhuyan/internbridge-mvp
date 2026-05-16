import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { studentsRouter } from "./routes/students.js";
import { employersRouter } from "./routes/employers.js";
import { internshipsRouter } from "./routes/internships.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true, service: "InternBridge MVP" }));

app.use("/auth", authRouter);
app.use("/students", studentsRouter);
app.use("/employers", employersRouter);
app.use("/internships", internshipsRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.name === "ZodError") return res.status(400).json({ error: err.errors });
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`InternBridge API running on http://localhost:${port}`));
