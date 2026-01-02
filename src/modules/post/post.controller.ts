import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

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

    const searchStr = typeof search === "string" ? search : undefined;


    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];


    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

      const status = req.query.status as PostStatus | undefined;

      const authorId = req.query.authorId as string | undefined;
      console.log(authorId)
    const result = await postService.getAllPosts({
      search: searchStr,
      tags: tags as string[],
      isFeatured,
      status,
      authorId
    });
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
