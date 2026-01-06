import { Request, Response } from "express";
import { commentService } from "./comments.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).send(result);
  } catch (err: any) {
    res.status(500).send(err);
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
      message: err,
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
      message: err,
    });
  }
};

const deleteCommentById = async (req: Request, res: Response) => {
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
};

export const commentController = {
  createComment,
  getCommentById,
  getCommentsByAuthorId,
  deleteCommentById
};
