import { boolean, string } from "better-auth/*";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { PostWhereInput } from "../../../generated/prisma/models";

const createPost = async (
  data: Omit<Post, "post_id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async (payload: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const {
    search,
    tags,
    isFeatured,
    status,
    authorId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  } = payload;

  const andCondition: PostWhereInput[] = [];

  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andCondition.push({ isFeatured });
  }

  if (status) {
    andCondition.push({ status });
  }

  if (authorId) {
    andCondition.push({ authorId });
  }
  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andCondition,
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  const getAllData = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });
  return {
    data: result,
    pagination: {
      total: getAllData,
      page,
      limit,
      totalPage: Math.ceil(getAllData / limit),
    },
  };
};

const getPostById = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        post_id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        post_id: id,
      },
    });
    return postData;
  });
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
};
