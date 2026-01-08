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

router.get("/dashboard/stats", auth(UserRole.ADMIN), postController.getStats);

router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.updatePost
);
router.delete(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.deletePost
);

export const postRouter = router;
