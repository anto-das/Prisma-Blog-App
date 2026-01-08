import { Request, Response } from "express";
import { commentService } from "./comments.service";
import { success } from "better-auth/*";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).send(result);
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await commentService.getCommentById(id as string);
    res.status(200).send({
      success: true,
      message: "Retrieved comment successfully..!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const getCommentsByAuthorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await commentService.getCommentsByAuthorId(id as string);
    res.status(200).send({
      success: true,
      message: "Retrieved comments successfully..!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;
    const result = await commentService.deleteCommentById(
      commentId as string,
      userId as string
    );
    res.status(200).send({
      success: true,
      message: "Comment deleted successfully!",
      data: result,
    });
  } catch (e: any) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    const data = req.body;
    const result = await commentService.updateComment(
      commentId as string,
      user?.id as string,
      data
    );
    res.status(200).send({
      success: true,
      message: "comment updated successfully!",
      data: result,
    });
  } catch (e: any) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
};

const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const status = req.body;
    const result = await commentService.moderateComment(
      commentId as string,
      status
    );
    res.status(200).send({
      result,
    });
  } catch (e: any) {
    res.status(500).send({
      success: false,
      message: e.message,
    });
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentsByAuthorId,
  deleteCommentById,
  updateComment,
  moderateComment,
};
