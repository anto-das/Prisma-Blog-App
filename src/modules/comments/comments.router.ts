import { Router } from "express";
import { commentController } from "./comments.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../Types/role.check";

const router: Router = Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.createComment
);

router.get(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getCommentById
);

router.get(
  "/author/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  commentController.getCommentsByAuthorId
);

router.delete(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.deleteCommentById
);

export const commentRouter = router;
