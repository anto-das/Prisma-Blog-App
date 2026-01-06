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

export const commentRouter = router;
