import { prisma } from "../services/db.js";

export class ReportController {
  /**
   * Report a post
   */
  static async reportPost(req, res) {
    try {
      const { post_id } = req.params;
      const { reason } = req.body;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await prisma.$transaction(async (prisma) => {
        // Check if the post exists in the reporting table
        const existingReport = await prisma.postinganReport.findFirst({
          where: {
            post_id: parseInt(post_id),
            user_id: user_id
          }
        });

        if (existingReport) {
          throw new Error("You already reported this post");
        }

        // Create report
        await prisma.postinganReport.create({
          data: {
            post_id: parseInt(post_id),
            user_id,
            reason
          }
        });
      });

      return res.status(201).json({ message: "Post reported successfully" });
    } catch (error) {
      if (error.message === "You already reported this post") {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get all reports (Admin only)
   */
  static async getAllReports(req, res) {
    try {
      const user_role = req.user?.role;

      if (user_role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const reports = await prisma.postinganReport.findMany({
        orderBy: { created_at: "desc" },
        include: {
          Postingan: {
            select: {
              id: true,
              content: true,
              User: {
                select: {
                  username: true
                }
              }
            }
          },
          User: {
            select: {
              username: true
            }
          }
        }
      });

      return res.status(200).json(reports);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * Update report status (Admin only)
   */
  static async updateReportStatus(req, res) {
    try {
      const { report_id } = req.params;
      const { status } = req.body;
      const user_role = req.user?.role;

      if (user_role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const allowedStatuses = ["pending", "resolved", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const result = await prisma.postinganReport.update({
        where: { id: parseInt(report_id) },
        data: { status }
      });

      if (!result) {
        return res.status(404).json({ message: "Report not found" });
      }

      return res.status(200).json({ message: "Report status updated" });
    } catch (error) {
      if (error.code === "P2025") { // Prisma not found error code
        return res.status(404).json({ message: "Report not found" });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get reports for a specific post (Admin/Moderator)
   */
  static async getPostReports(req, res) {
    try {
      const { post_id } = req.params;
      const user_role = req.user?.role;

      if (!["admin", "moderator"].includes(user_role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
      }

      const reports = await prisma.postinganReport.findMany({
        where: { post_id: parseInt(post_id) },
        orderBy: { created_at: "desc" },
        include: {
          User: {
            select: {
              username: true,
              avatar: true
            }
          }
        }
      });

      return res.status(200).json(reports);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}