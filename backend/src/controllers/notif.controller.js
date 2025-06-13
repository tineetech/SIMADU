import { prisma } from "../services/db.js";
import jwt from "jsonwebtoken";

export class NotifController {
  async getNotifs(req, res) {
    try {
      const notifications = await prisma.notifikasi.findMany({
        include: {
          User: {
            select: {
              username: true,
              email: true,
            },
          },
          Laporan: {
            select: {
              description: true,
              status: true,
            },
          },
        },
      });

      res.json({
        status: 200,
        message: "Success get data",
        data: notifications,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async createNotifs(req, res) {
    try {
      const { user_id, laporan_id, title, message } = req.body;

      // Validate user exists
      const userExists = await prisma.user.findUnique({
        where: { user_id: parseInt(user_id) },
      });
      if (!userExists) {
        return res.status(400).json({ error: "User not found" });
      }

      // Validate report exists if laporan_id is provided
      if (laporan_id) {
        const reportExists = await prisma.laporan.findUnique({
          where: { id: parseInt(laporan_id) },
        });
        if (!reportExists) {
          return res.status(400).json({ error: "Report not found" });
        }
      }

      const newNotification = await prisma.notifikasi.create({
        data: {
          user_id: parseInt(user_id),
          laporan_id: laporan_id ? parseInt(laporan_id) : null,
          title,
          message,
        },
      });

      res.json({
        status: 200,
        message: "Success create data",
        data: newNotification,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async updateNotif(req, res) {
    try {
      const { id } = req.params;
      const { user_id, laporan_id, title, message, is_read } = req.body;

      // Check if notification exists
      const existingNotif = await prisma.notifikasi.findUnique({
        where: { id: parseInt(id) },
      });
      if (!existingNotif) {
        return res.status(404).json({ error: "Notification not found" });
      }

      // Validate user exists if user_id is being updated
      if (user_id) {
        const userExists = await prisma.user.findUnique({
          where: { user_id: parseInt(user_id) },
        });
        if (!userExists) {
          return res.status(400).json({ error: "User not found" });
        }
      }

      // Validate report exists if laporan_id is being updated
      if (laporan_id) {
        const reportExists = await prisma.laporan.findUnique({
          where: { id: parseInt(laporan_id) },
        });
        if (!reportExists) {
          return res.status(400).json({ error: "Report not found" });
        }
      }

      const updatedNotif = await prisma.notifikasi.update({
        where: { id: parseInt(id) },
        data: {
          user_id: user_id ? parseInt(user_id) : undefined,
          laporan_id: laporan_id ? parseInt(laporan_id) : undefined,
          title,
          message,
          is_read: is_read ?? false,
          updated_at: new Date(),
        },
      });

      res.json({
        status: 200,
        message: "Success update data",
        data: updatedNotif,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async deleteNotif(req, res) {
    try {
      const { id } = req.params;

      // Check if notification exists
      const existingNotif = await prisma.notifikasi.findUnique({
        where: { id: parseInt(id) },
      });
      if (!existingNotif) {
        return res.status(404).json({ error: "Notification not found" });
      }

      const deletedNotif = await prisma.notifikasi.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        status: 200,
        message: "Success remove data",
        data: deletedNotif,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Notification not found" });
      }
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }

  async getNotifsByUserId(req, res) {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const notifications = await prisma.notifikasi.findMany({
        where: { user_id: parseInt(user_id) },
        include: {
          Laporan: {
            select: {
              description: true,
              status: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      if (notifications.length === 0) {
        return res.status(404).json({ 
          message: "No notifications found for this user" 
        });
      }

      res.json({
        status: 200,
        message: "Success get notifications by user",
        data: notifications,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: message });
    }
  }
}