import { prisma } from "../services/db.js";

export class BridgeController {
  static async toggleLikePost(req, res) {
    try {
      const user_id = req.user?.id;
      const { post_id } = req.params;

      if (!user_id) return res.status(401).json({ message: "Unauthorized" });

      // Check if like exists
      const existingLike = await prisma.postinganLike.findFirst({
        where: {
          post_id: parseInt(post_id),
          user_id,
        },
      });

      if (existingLike) {
        // Unlike the post
        await prisma.postinganLike.delete({
          where: {
            id: existingLike.id,
          },
        });
        return res.status(200).json({ message: "Unliked" });
      } else {
        // Like the post
        await prisma.postinganLike.create({
          data: {
            post_id: parseInt(post_id),
            user_id,
          },
        });
        return res.status(200).json({ message: "Liked" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async addComment(req, res) {
    try {
      const { post_id } = req.params;
      const user_id = req.user?.id;
      const { content } = req.body;

      if (!content) {
        return res
          .status(400)
          .json({ message: "Komentar tidak boleh kosong." });
      }

      const newComment = await prisma.postinganComment.create({
        data: {
          post_id: parseInt(post_id),
          user_id,
          content,
        },
      });

      return res.status(201).json({
        message: "Komentar berhasil ditambahkan.",
        comment: newComment,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const { post_id } = req.body;
      const user_id = req.user?.id;
      const user_role = req.user?.role;

      // Find the comment
      const comment = await prisma.postinganComment.findUnique({
        where: { id: parseInt(id) },
      });

      if (!comment) {
        return res.status(404).json({ message: "Komentar tidak ditemukan" });
      }

      if (comment.post_id !== parseInt(post_id)) {
        return res
          .status(400)
          .json({ message: "Komentar tidak sesuai dengan post_id" });
      }

      // Check permissions
      if (user_id !== comment.user_id && user_role !== "admin") {
        return res.status(403).json({
          message: "Forbidden: Tidak bisa menghapus komentar orang lain",
        });
      }

      // Delete the comment
      await prisma.postinganComment.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: "Komentar berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan saat menghapus komentar",
        error: error.message,
      });
    }
  }

  static async addReply(req, res) {
    try {
      const { comment_id } = req.params;
      const user_id = req.user?.id;
      const { content, parent_reply_id } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Balasan tidak boleh kosong." });
      }

      // Check if parent comment exists
      const parentComment = await prisma.postinganComment.findUnique({
        where: { id: parseInt(comment_id) },
      });

      if (!parentComment) {
        return res.status(404).json({ message: "Komentar tidak ditemukan." });
      }

      // If replying to another reply, check if it exists
      if (parent_reply_id) {
        const parentReply = await prisma.postinganCommentReply.findUnique({
          where: { id: parseInt(parent_reply_id) },
        });

        if (!parentReply) {
          return res.status(404).json({ message: "Balasan tidak ditemukan." });
        }
      }

      const newReply = await prisma.postinganCommentReply.create({
        data: {
          comment_id: parseInt(comment_id),
          user_id,
          content,
          parent_reply_id: parent_reply_id ? parseInt(parent_reply_id) : null,
        },
      });

      return res.status(201).json({
        message: "Balasan berhasil ditambahkan.",
        reply: newReply,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteReply(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;
      const user_role = req.user?.role;

      const reply = await prisma.postinganCommentReply.findUnique({
        where: { id: parseInt(id) },
      });

      if (!reply) {
        return res.status(404).json({ message: "Balasan tidak ditemukan" });
      }

      if (user_id !== reply.user_id && user_role !== "admin") {
        return res.status(403).json({
          message: "Forbidden: Tidak bisa menghapus balasan orang lain",
        });
      }

      await prisma.postinganCommentReply.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: "Balasan berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getReplies(req, res) {
    try {
      const { comment_id } = req.params;

      // Ambil semua reply dari DB
      const replies = await prisma.postinganCommentReply.findMany({
        where: { comment_id: parseInt(comment_id) },
        orderBy: { created_at: "asc" },
        include: {
          User: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });

      // Format hasil
      const formattedReplies = replies.map((reply) => ({
        id: reply.id,
        comment_id: reply.comment_id,
        user_id: reply.user_id,
        content: reply.content,
        created_at: reply.created_at,
        username: reply.User?.username || null,
        avatar: reply.User?.avatar || null,
      }));

      return res.status(200).json(formattedReplies);
    } catch (error) {
      console.error("Error getting replies:", error);
      return res.status(500).json({ message: error.message });
    }
  }
}
