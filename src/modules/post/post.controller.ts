import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSorting from "../../helper/paginationSorting";
import { UserRole } from "../../Types/role.check";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
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
    next(e);
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
    if (!user) {
      res.status(403).send({
        success: false,
        message: "Your are not sign in at the time",
      });
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
      message: e,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(403).send({
        success: false,
        message: "unauthorized access!",
      });
    }
    const { postId } = req.params;
    const data = req.body;
    const isAdmin = user?.role === UserRole.ADMIN;
    const result = await postService.updatePost(
      postId as string,
      user?.id as string,
      data,
      isAdmin
    );
    res.status(200).send({
      success: true,
      message: "post updated successfully!",
      data: result,
    });
  } catch (e: any) {
    res.status(500).send({
      success: false,
      message: e,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(403).send({
        success: false,
        message: "unauthorized access!",
      });
    }
    console.log(user);
    const { postId } = req.params;
    const isAdmin = user?.role === UserRole.ADMIN;
    const result = await postService.deletePost(
      postId as string,
      user?.id as string,
      isAdmin
    );
    res.status(200).send({
      success: true,
      message: "post delete successfully!",
      data: result,
    });
  } catch (e: any) {
    const errorMessage = e instanceof Error ? e.message : "delete failed";
    res.status(500).send({
      success: false,
      message: errorMessage,
    });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postService.getStats();
    res.status(200).send({
      success: true,
      data: result,
    });
  } catch (e: any) {
    const errorMessage =
      e instanceof Error ? e.message : "stats fetched failed";
    res.status(500).send({
      success: false,
      message: errorMessage,
    });
  }
};

export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
