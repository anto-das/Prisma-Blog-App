import express, { Request, Response } from "express";
import { postRouter } from "./modules/post/post.routes";

const app = express();
app.use(express.json())
app.get("/", async (req: Request, res: Response) => {
  res.send("hello prisma blog app server");
});

app.use("/posts",postRouter)

export default app;
