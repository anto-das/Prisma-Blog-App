import express, { Request, Response } from "express";
import { postRouter } from "./modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
  origin:[process.env.APP_URL!]
}))
app.get("/", async (req: Request, res: Response) => {
  res.send("hello prisma blog app server");
});

app.use("/posts",postRouter)

app.all("/api/auth/*splat", toNodeHandler(auth));


export default app;
