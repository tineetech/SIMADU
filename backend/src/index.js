import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routers
import { ScrapeRouter } from "./routers/scrape.router.js";
import { UsersRouter } from "./routers/users.router.js";
import { PostRouter } from "./routers/post.router.js";
import { NotifRouter } from "./routers/notif.router.js";
import { LaporRouter } from "./routers/lapor.router.js";
import { KoinRouter } from "./routers/koin.router.js";
import { AuthRouter } from "./routers/auth.router.js";

// Setup
const app = express();
const PORT = process.env.PORT || 5001;
const base_url_fe = process.env.FE_URL;

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/api/berita", new ScrapeRouter().getRouter());
app.use("/api/users", new UsersRouter().getRouter());
app.use("/api/postingan", new PostRouter().getRouter());
app.use("/api/notif", new NotifRouter().getRouter());
app.use("/api/lapor", new LaporRouter().getRouter());
app.use("/api/koin", new KoinRouter().getRouter());
app.use("/api/auth", new AuthRouter().getRouter());

// Home route
app.get("/", (req, res) => {
  res.status(200).json({ server: "on", message: "server is online." });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
