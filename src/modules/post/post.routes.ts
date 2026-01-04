import { NextFunction, Request, Response, Router } from "express";
import { postController } from "./post.controller";
import { UserRole } from "../../Types/role.check";
import auth from "../../middleware/auth";

const router: Router = Router();

router.post("/", auth(UserRole.USER), postController.createPost);
router.get("/", postController.getAllPosts);
router.get(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.getPostById
);

export const postRouter = router;
