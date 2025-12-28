import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(req.body);
    res.status(201).send(result)
  } catch (e:any) {
    res.status(500).send({
       success:false,
       message:e
    })
  }
};

export const postController = {
  createPost,
};
