import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { manejarError, rutaNoEncontrada } from "./middlewares/errors.js";
import { rutas } from "./routes/index.js";
import { ErrorAplicacion } from "./utils/errors.js";

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin(origen, callback) {
    if (!origen || env.frontendUrls.includes(origen)) return callback(null, true);
    return callback(new ErrorAplicacion("El origen de la solicitud no está autorizado.", 403, "ORIGEN_NO_PERMITIDO"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 200, standardHeaders: "draft-8", legacyHeaders: false }));
app.get("/health", (_req, res) => res.json({ estado: "ok", modo: env.demoMode ? "demo" : "produccion" }));
app.use("/api", rutas);
app.use(rutaNoEncontrada);
app.use(manejarError);
