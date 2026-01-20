import express from "express";
import cors from "cors";
import routes from "./10_routes";
import pollHistoryRoutes from "./10_routes";

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());

app.use("/api", routes);


app.use("/api", pollHistoryRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
