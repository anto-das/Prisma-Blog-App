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

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchStr = typeof search === 'string' ? search : undefined;
    const result = await postService.getAllPosts({search:searchStr});
    res.status(200).send({
      success: true,
      message: "Retrieved all posts successfully!",
      data: result,
    });
  } catch (e: any) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
};

export const postController = {
  createPost,
  getAllPosts,
};
