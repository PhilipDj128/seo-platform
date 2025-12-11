import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type JwtPayload = { userId: string; email: string };
type ProjectInput = {
  domain: string;
  industry: string;
  cities: string[];
};

interface RequestWithUser extends Request {
  user?: JwtPayload;
  supabase?: SupabaseClient;
}

const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  JWT_SECRET = "change-me",
  CLIENT_URL = "http://localhost:3000",
  PORT = "4000",
} = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("⚠️ SUPABASE_URL eller SUPABASE_ANON_KEY saknas i miljövariabler.");
}

const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_ANON_KEY ?? "");
const app = express();

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Ingen token angiven" });
  }
  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    req.supabase = supabase;
    next();
  } catch {
    return res.status(401).json({ message: "Ogiltig eller utgången token" });
  }
};

app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: "E-post och lösenord krävs." });
  }

  const { data: existing } = await supabase.from("users").select("id").eq("email", email).single();
  if (existing) {
    return res.status(409).json({ message: "Användaren finns redan." });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert({ email, password_hash })
    .select("id, email")
    .single();

  if (error || !data) {
    return res.status(500).json({ message: error?.message ?? "Kunde inte skapa användare." });
  }

  const token = jwt.sign({ userId: data.id, email: data.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(201).json({ message: "Konto skapat", token });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: "E-post och lösenord krävs." });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, password_hash")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: "Fel e-post eller lösenord." });
  }

  const match = await bcrypt.compare(password, (user as any).password_hash);
  if (!match) {
    return res.status(401).json({ message: "Fel e-post eller lösenord." });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.json({ message: "Inloggad", token });
});

app.post("/api/auth/logout", (_req, res) => {
  res.json({ message: "Utloggad. Rensa token i klienten." });
});

app.get("/api/user", authMiddleware, (req: RequestWithUser, res: Response) => {
  return res.json({ user: req.user });
});

app.get("/api/projects", authMiddleware, async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.userId;
  const { data, error } = await supabase
    .from("projects")
    .select("id, user_id, domain, industry, cities, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ message: error.message });
  }
  return res.json(data ?? []);
});

app.post("/api/projects", authMiddleware, async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.userId;
  const { domain, industry, cities } = req.body as ProjectInput;
  if (!domain || !industry) {
    return res.status(400).json({ message: "Domän och bransch krävs." });
  }
  const cityArray = Array.isArray(cities) ? cities : [];
  const { data, error } = await supabase
    .from("projects")
    .insert({ domain, industry, cities: cityArray, user_id: userId })
    .select("id, user_id, domain, industry, cities, created_at")
    .single();

  if (error || !data) {
    return res.status(500).json({ message: error?.message ?? "Kunde inte skapa projekt." });
  }

  return res.status(201).json(data);
});

app.get("/api/projects/:id", authMiddleware, async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.userId;
  const projectId = req.params.id;

  const { data, error } = await supabase
    .from("projects")
    .select("id, user_id, domain, industry, cities, created_at")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: "Projektet hittades inte." });
  }

  return res.json(data);
});

app.put("/api/projects/:id", authMiddleware, async (req: RequestWithUser, res: Response) => {
  const userId = req.user?.userId;
  const projectId = req.params.id;
  const { domain, industry, cities } = req.body as Partial<ProjectInput>;

  const { data, error } = await supabase
    .from("projects")
    .update({
      ...(domain ? { domain } : {}),
      ...(industry ? { industry } : {}),
      ...(Array.isArray(cities) ? { cities } : {}),
    })
    .eq("id", projectId)
    .eq("user_id", userId)
    .select("id, user_id, domain, industry, cities, created_at")
    .single();

  if (error || !data) {
    return res.status(404).json({ message: error?.message ?? "Projektet hittades inte." });
  }

  return res.json(data);
});

app.listen(Number(PORT), () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});


