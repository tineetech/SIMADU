import { prisma } from "../services/db.js";
import dotenv from "dotenv";
dotenv.config();

export class PostController {
  static async createPost(req, res) {
    try {
      const {
        content = req.body.content,
        type,
        status,
        media_url, // from frontend (Vercel Blob)
        polling_options,
        postingan_comments,
      } = req.body;

      const user_id = req.user?.id;
      // console.log(req.user);


      if (!user_id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const statusValue = status || PostinganStatus.active;
      const allowedTypes = Object.values(PostinganType);
      const cleanType = allowedTypes.includes(type) ? type : PostinganType.text;

      // Start transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Create base post
        const post = await prisma.postingan.create({
          data: {
            user_id,
            type: cleanType,
            content,
            status: statusValue,
          },
        });

        if (cleanType === PostinganType.image) {
          if (!media_url) {
            throw new Error("URL gambar harus disertakan.");
          }

          await prisma.postinganImage.create({
            data: {
              post_id: post.id,
              image: media_url,
            },
          });
          return { post, message: "Postingan berhasil dibuat dengan gambar" };
        }

        if (cleanType === PostinganType.video) {
          if (!media_url) {
            throw new Error("URL video harus disertakan.");
          }

          await prisma.postinganVideo.create({
            data: {
              post_id: post.id,
              url_video: media_url,
            },
          });
          return { post, message: "Postingan berhasil dibuat dengan video" };
        }

        if (cleanType === PostinganType.polling) {
          if (
            !polling_options ||
            !Array.isArray(polling_options) ||
            polling_options.length < 2
          ) {
            throw new Error("Polling harus memiliki minimal dua pilihan.");
          }

          await prisma.postinganPollingOption.createMany({
            data: polling_options.map((content) => ({
              post_id: post.id,
              content,
            })),
          });

          return { post, message: "Postingan polling berhasil dibuat" };
        }

        if (postingan_comments?.length > 0) {
          await prisma.postinganComment.createMany({
            data: postingan_comments.map((content) => ({
              post_id: post.id,
              user_id,
              content,
            })),
          });
        }

        return { post, message: "Postingan berhasil dibuat" };
      });

      return res.status(201).json({
        message: result.message,
        postId: result.post.id,
        type: cleanType,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllPosts(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      if (
        isNaN(pageNumber) ||
        pageNumber < 1 ||
        isNaN(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 100
      ) {
        return res
          .status(400)
          .json({ message: "Parameter page dan limit tidak valid." });
      }

      const offset = (pageNumber - 1) * limitNumber;

      // Get total count of posts
      const totalPosts = await prisma.postingan.count();
      const totalPages = Math.ceil(totalPosts / limitNumber);

      // Get posts with pagination
      const posts = await prisma.postingan.findMany({
        skip: offset,
        take: limitNumber,
        orderBy: { created_at: "desc" },
        include: {
          Images: { select: { image: true } },
          Video: { select: { url_video: true } },
          Likes: { select: { user_id: true } },
          User: {
            select: {
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              Likes: true,
              Comments: true,
            },
          },
          Comments: {
            include: {
              User: {
                select: {
                  username: true,
                  avatar: true,
                },
              },
              Replies: {
                include: {
                  User: {
                    select: {
                      username: true,
                      avatar: true,
                    },
                  },
                },
                orderBy: { created_at: "asc" },
              },
            },
            orderBy: { created_at: "asc" },
          },
        },
      });

      // Process each post
      const processedPosts = posts.map((post) => {
        // Format comments with user data
        const processedComments = post.Comments.map((comment) => ({
          id: comment.id,
          user_id: comment.user_id,
          content: comment.content,
          created_at: comment.created_at,
          username: comment.User?.username || null,
          avatar: comment.User?.avatar || null,
          replies: comment.Replies.map((reply) => ({
            id: reply.id,
            user_id: reply.user_id,
            content: reply.content,
            created_at: reply.created_at,
            username: reply.User?.username || null,
            avatar: reply.User?.avatar || null,
          })),
        }));

        return {
          ...post,
          image: post.Images[0]?.image || null,
          url_video: post.Video?.url_video || null,
          like_count: post._count.Likes,
          comment_count: post._count.Comments,
          likers: post.Likes.map((like) => like.user_id),
          user: {
            username: post.User?.username || null,
            avatar: post.User?.avatar || null,
          },
          comments: processedComments,
        };
      });

      return res.status(200).json({
        data: processedPosts,
        pagination: {
          currentPage: pageNumber,
          totalPages: totalPages,
          totalItems: totalPosts,
          itemsPerPage: limitNumber,
        },
      });
    } catch (error) {
      console.error("Error in getAllPosts with pagination:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async getPostById(req, res) {
    try {
      const { id } = req.params;
      const postId = parseInt(id);

      // Get post with all related data
      const post = await prisma.postingan.findUnique({
        where: { id: postId },
        include: {
          User: {
            select: {
              username: true,
              avatar: true,
            },
          },
          Images: { select: { image: true } },
          Video: { select: { url_video: true } },
          PollingOptions: {
            include: {
              _count: {
                select: { Votes: true },
              },
              Votes: {
                select: { user_id: true },
              },
            },
          },
          _count: {
            select: {
              Likes: true,
              Comments: true,
            },
          },
          Comments: {
            include: {
              User: {
                select: {
                  username: true,
                  avatar: true,
                },
              },
              Replies: {
                include: {
                  User: {
                    select: {
                      username: true,
                      avatar: true,
                    },
                  },
                },
                orderBy: { created_at: "asc" },
              },
            },
            orderBy: { created_at: "asc" },
          },
        },
      });

      if (!post) {
        return res.status(404).json({ message: "Postingan tidak ditemukan" });
      }

      // Calculate polling stats
      let pollingOptions = [];
      if (post.PollingOptions.length > 0) {
        const totalVotes = await prisma.postinganPollingVote.count({
          where: {
            option_id: {
              in: post.PollingOptions.map((option) => option.id),
            },
          },
        });

        pollingOptions = post.PollingOptions.map((option) => ({
          id: option.id,
          content: option.content,
          votes: option._count.Votes,
          percentage:
            totalVotes > 0
              ? Math.round((option._count.Votes / totalVotes) * 100)
              : 0,
        }));
      }

      // Format comments
      const formattedComments = post.Comments.map((comment) => ({
        id: comment.id,
        user_id: comment.user_id,
        content: comment.content,
        created_at: comment.created_at,
        username: comment.User?.username || "Unknown",
        avatar: comment.User?.avatar || null,
        replies: comment.Replies.map((reply) => ({
          id: reply.id,
          user_id: reply.user_id,
          content: reply.content,
          created_at: reply.created_at,
          username: reply.User?.username || "Unknown",
          avatar: reply.User?.avatar || null,
        })),
      }));

      const responseData = {
        ...post,
        image: post.Images[0]?.image || null,
        url_video: post.Video?.url_video || null,
        like_count: post._count.Likes,
        comment_count: post._count.Comments,
        polling_options: pollingOptions,
        user: {
          username: post.User?.username || "Unknown",
          avatar: post.User?.avatar || null,
        },
        comments: formattedComments,
      };

      return res.status(200).json({
        message: "Success get post by id",
        data: responseData,
      });
    } catch (error) {
      console.error("Error in getPostById:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async updatePost(req, res) {
    try {
      const { id } = req.params;
      const postId = parseInt(id);
      const { content, status, postingan_comments } = req.body;
      const statusValue = status
        ? PostinganStatus.active
        : PostinganStatus.draft;

      // Start transaction
      await prisma.$transaction(async (prisma) => {
        // Update post
        const updatedPost = await prisma.postingan.update({
          where: { id: postId },
          data: {
            content,
            status: statusValue,
            updated_at: new Date(),
          },
        });

        // Add new comments if provided
        if (postingan_comments && postingan_comments.length > 0) {
          await prisma.postinganComment.createMany({
            data: postingan_comments.map((commentContent) => ({
              post_id: postId,
              user_id: req.user.id,
              content: commentContent,
            })),
          });
        }

        return updatedPost;
      });

      return res.status(200).json({ message: "Postingan berhasil diupdate" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const postId = parseInt(id);
      const user_id = req.user?.id;
      const user_role = req.user?.role;

      // Start transaction
      await prisma.$transaction(async (prisma) => {
        // Get post to verify ownership
        const post = await prisma.postingan.findUnique({
          where: { id: postId },
          select: { user_id: true },
        });

        if (!post) {
          throw new Error("Postingan tidak ditemukan");
        }

        // Check permissions
        if (user_role !== "admin" && post.user_id !== user_id) {
          throw new Error(
            "Forbidden: Kamu tidak boleh menghapus postingan ini"
          );
        }

        // Delete post (cascading deletes will handle related records)
        await prisma.postingan.delete({
          where: { id: postId },
        });
      });

      return res.status(200).json({ message: "Postingan berhasil dihapus" });
    } catch (error) {
      if (error.message === "Postingan tidak ditemukan") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes("Forbidden")) {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  static async checkPostinganExists(postingan_id) {
    const post = await prisma.postingan.findUnique({
      where: { id: postingan_id },
    });
    if (!post) throw new Error("Postingan tidak ditemukan");
  }

  static async votePoll(req, res) {
    try {
      const user_id = req.user?.id;
      const { post_id, option_id } = req.params;
      const postId = parseInt(post_id);
      const optionId = parseInt(option_id);

      // Start transaction
      await prisma.$transaction(async (prisma) => {
        // Verify option belongs to post
        const option = await prisma.postinganPollingOption.findUnique({
          where: { id: optionId },
          select: { post_id: true },
        });

        if (!option) {
          throw new Error("Opsi tidak valid");
        }

        if (option.post_id !== postId) {
          throw new Error("Post ID tidak sesuai dengan opsi");
        }

        // Check if user has already voted in this poll
        const existingVote = await prisma.postinganPollingVote.findFirst({
          where: {
            user_id,
            Option: {
              post_id: postId,
            },
          },
        });

        if (existingVote) {
          throw new Error("Anda sudah melakukan vote pada post ini");
        }

        // Record the vote
        await prisma.postinganPollingVote.create({
          data: {
            option_id: optionId,
            user_id,
          },
        });
      });

      return res.status(201).json({ message: "Vote berhasil dicatat" });
    } catch (error) {
      if (error.message === "Opsi tidak valid") {
        return res.status(404).json({ message: error.message });
      }
      if (
        error.message === "Post ID tidak sesuai dengan opsi" ||
        error.message === "Anda sudah melakukan vote pada post ini"
      ) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }
}

// Enums that should be defined elsewhere in your code
const PostinganStatus = {
  active: "active",
  draft: "draft",
};

const PostinganType = {
  text: "text",
  image: "image",
  video: "video",
  polling: "polling",
};
