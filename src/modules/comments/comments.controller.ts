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

export const commentController = {
  createComment,
};
