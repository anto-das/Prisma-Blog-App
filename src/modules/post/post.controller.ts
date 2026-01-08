import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSorting from "../../helper/paginationSorting";

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

    const { page, limit, skip, sortBy, sortOrder } = paginationSorting(
      req.query
    );

    const result = await postService.getAllPosts({
      search: searchStr,
      tags: tags as string[],
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
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

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post id required...");
    }
    const result = await postService.getPostById(postId as string);
    res.status(200).send({
      success: true,
      message: "Retrieved your request data successfully.!",
      data: result,
    });
  } catch (e: any) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if(!user){
      res.status(403).send({
        success:false,
        message:"Your are not sign in at the time",
      })
    }
    const result = await postService.getMyPosts(user?.id as string);
    res.status(200).send({
      success: false,
      message: "Retrieved all user posts successfully!",
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
  getPostById,
  getMyPosts,
};
