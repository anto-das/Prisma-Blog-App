import express, { request, Request, Response } from "express";
import { postRouter } from "./modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./modules/comments/comments.router";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.APP_URL!],
    credentials: true,
  })
);
app.get("/", async (req: Request, res: Response) => {
  res.send("hello prisma blog app server");
});

app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use((req: Request, res: Response) => {
  res.status(404).send({
    message: "Route not found.",
    url: req.url,
    method: req.method,
  });
});
app.use(globalErrorHandler);

export default app;
