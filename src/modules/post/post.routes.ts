import { NextFunction, Request, Response, Router } from "express";
import { postController } from "./post.controller";
import { UserRole } from "../../Types/role.check";
import auth from "../../middleware/auth";

const router: Router = Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);
router.get("/", postController.getAllPosts);
router.get(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.getPostById
);

router.get(
  "/user/my-posts",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.getMyPosts
);

export const postRouter = router;
