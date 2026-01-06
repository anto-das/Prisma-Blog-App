import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      post_id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        comment_id: payload.parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

export const commentService = {
  createComment,
};
