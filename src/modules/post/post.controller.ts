import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(403).send({
        success: false,
        message: "forbidden access",
      });
    }
    const result = await postService.createPost(req.body, user?.id as string);
    res.status(201).send(result);
  } catch (e: any) {
    res.status(500).send({
      success: false,
      message: e,
    });
  }
};

export const postController = {
  createPost,
};
