import { CommentStatus } from "../../../generated/prisma/enums";
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

const getCommentById = async (id: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      comment_id: id,
    },
    include: {
      posts: {
        select: {
          post_id: true,
          title: true,
          views: true,
        },
      },
    },
  });
  return result;
};

const getCommentsByAuthorId = async (id: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId: id,
    },
    include: {
      posts: {
        select: {
          post_id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const deleteCommentById = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      comment_id: commentId,
      authorId,
    },
  });

  if (!commentData) {
    throw new Error("comments not found");
  }

  return await prisma.comment.delete({
    where: {
      comment_id: commentData.comment_id,
    },
  });
};

const updateComment = async (
  comment_id: string,
  authorId: string,
  data: { content?: string; status?: CommentStatus }
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      comment_id,
      authorId,
    },
  });

  if (!commentData) {
    throw new Error("comment not found..");
  }

  const result = await prisma.comment.update({
    where: {
      comment_id: commentData.comment_id,
    },
    data,
  });
  return result;
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
  await prisma.comment.findUniqueOrThrow({
    where: {
      comment_id: id,
    },
  });

  return await prisma.comment.update({
    where: {
      comment_id: id,
    },
    data,
  });
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentsByAuthorId,
  deleteCommentById,
  updateComment,
  moderateComment,
};
