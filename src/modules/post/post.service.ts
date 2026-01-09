import { boolean, string } from "better-auth/*";
import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { PostWhereInput } from "../../../generated/prisma/models";
import { UserRole } from "../../Types/role.check";

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
    include: {
      _count: {
        select: { comments: true },
      },
    },
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
  const result = await prisma.$transaction(async (tx) => {
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
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { createdAt: "asc" },
              include: {
                replies: true,
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });

  return result;
};

const getMyPosts = async (authorId: string) => {
  // console.log(authorId)

  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
  });

  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};

//

const updatePost = async (
  post_id: string,
  authorId: string,
  data: Partial<Post>,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      post_id,
    },
    select: {
      post_id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("you are not creator/owner of this post...");
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }

  const result = await prisma.post.update({
    where: {
      post_id,
    },
    data,
  });
  return result;
};

const deletePost = async (
  post_id: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      post_id,
    },
    select: {
      post_id: true,
      authorId: true,
    },
  });

  if (!isAdmin && authorId !== postData.post_id) {
    throw new Error(
      "you can't delete this post you not the owner/creator of this post"
    );
  }

  const result = await prisma.post.delete({
    where: {
      post_id,
    },
  });
  return result;
};

const getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalComments,
      publishedPost,
      approvedComment,
      archivedPost,
      draftPost,
      rejectedPost,
      users,
      totalAdmin,
      totalUser,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({ where: { status: "PUBLISHED" } }),
      await tx.post.count({ where: { status: "ARCHIVED" } }),
      await tx.post.count({ where: { status: "DRAFT" } }),
      await tx.comment.count(),
      await tx.comment.count({ where: { status: "APPROVED" } }),
      await tx.comment.count({ where: { status: "REJECTED" } }),
      await tx.user.count(),
      await tx.user.count({
        where: {
          role: UserRole.ADMIN,
        },
      }),
      await tx.user.count({ where: { role: UserRole.USER } }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPosts,
      totalComments,
      publishedPost,
      approvedComment,
      archivedPost,
      draftPost,
      rejectedPost,
      users,
      totalUser,
      totalAdmin,
      totalViews:totalViews._sum.views,
    };
  });
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
