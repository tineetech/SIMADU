import { prisma } from "../services/db.js";
import { put } from "@vercel/blob";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HF_ACCESS_TOKEN = process.env.HF_API_KEY;

export class LaporController {
  async analisisWithAi(req, res) {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "File gambar harus diupload." });
    }

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
    ];
    if (!allowedImageTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: "File harus berupa gambar (JPEG, PNG, JPG, GIF).",
      });
    }

    const blob = await put(file.originalname, file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.mimetype,
      addRandomSuffix: true,
    });

    const imagePath = blob.url;
    try {
      const response = await axios.get(imagePath, {
        responseType: "arraybuffer",
      });
      const base64Image = Buffer.from(response.data).toString("base64");

      const apiKeys = [
        "AIzaSyBct01Zunl6XInJJBK-xCLGgfw-Xt2_1Nw",
        "AIzaSyAhWg020Pz3Qs5k01kJicBZZd7RQ-E3P8M",
        "AIzaSyBXfLrI8nbCKH_mkC2rD9vL2atwo751nPM",
      ];

      const requestBody = {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: file.mimetype,
                  data: base64Image,
                },
              },
              {
                text: "Apakah gambar tersebut merupakan bencana alam atau kerusakan jalan, sampah menumpuk? Jelaskan temuanmu secara ringkas dan berikan kata awalan YA jika terindikasi dan TIDAK jika tidak terindikasi setelah itu penjelasannya.",
              },
            ],
          },
        ],
      };

      const fetchData = async (apiKey) => {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await axios.post(apiUrl, requestBody);

        if (response.status !== 200) {
          console.error(
            `Error from Gemini API with key ending in ${apiKey.slice(-5)}:`,
            response.data
          );
          throw {
            status: response.status,
            message: `Gagal menghubungi Gemini API dengan key ending in ${apiKey.slice(
              -5
            )}`,
            error: response.data,
          };
        }
        return response.data;
      };

      let responseData;
      let attempts = 0;

      while (attempts < apiKeys.length) {
        try {
          responseData = await fetchData(apiKeys[attempts]);
          break;
        } catch (error) {
          if (error.status === 429 || error.status >= 500) {
            console.log(
              `API Key ${attempts + 1} (ending in ${apiKeys[attempts].slice(
                -5
              )}) gagal, mencoba API Key ${attempts + 2}...`
            );
            attempts++;
          } else {
            return res.status(error.status).json({
              message: "Gagal menghubungi Gemini API.",
              error: error.error,
            });
          }
        }
      }

      if (attempts === apiKeys.length) {
        const errorMessage = "Semua API Key gagal menghubungi Gemini API.";
        console.error(errorMessage);
        return res.status(500).json({
          message: errorMessage,
          error: { message: "Semua API Key tidak dapat digunakan." },
        });
      }

      console.log("Respon dari Gemini API:", responseData);
      return res.status(200).json({ data: responseData, image: blob.url });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        message: "Terjadi kesalahan internal.",
        error: error.message,
      });
    }
  }

  async getLapor(req, res) {
    try {
      const laporans = await prisma.laporan.findMany({
        include: {
          User: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      res.status(200).json({
        status: 200,
        message: "success get data",
        data: laporans,
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }

  async createLapor(req, res) {
    try {
      const {
        user_id,
        location_lat,
        location_long,
        event_date,
        category,
        urlImage,
        isVerifyWithAi,
        description,
        type_verification,
        status,
        notes,
      } = req.body;

      // Validasi file
      let imageUrl;
      const file = req.file;
      if (!file && !isVerifyWithAi) {
        return res.status(400).json({ message: "File gambar harus diupload." });
      }

      const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
      ];
      if (file && !allowedImageTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "File harus berupa gambar (JPEG, PNG, JPG, GIF).",
        });
      }

      // Validasi user_id
      const userExists = await prisma.user.findUnique({
        where: { user_id: parseInt(user_id) },
      });
      if (!userExists) {
        return res.status(400).json({ message: "User not found" });
      }

      if (!isVerifyWithAi) {
        const blob = await put(file.originalname, file.buffer, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: file.mimetype,
          addRandomSuffix: true,
        });
        imageUrl = blob.url;
      } else {
        imageUrl = urlImage;
      }

      const newLaporan = await prisma.laporan.create({
        data: {
          user_id: parseInt(user_id),
          image: imageUrl,
          description,
          type_verification: type_verification || "ai",
          status: status || "pending",
          notes: notes || null,
          location_latitude: location_lat,
          location_longitude: location_long,
          event_date: new Date(event_date),
          category: category || "lainnya",
        },
      });

      res.status(200).json({
        status: 200,
        data: newLaporan,
        message: "Berhasil membuat laporan!",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      // Cek laporan
      const laporan = await prisma.laporan.findUnique({
        where: { id: parseInt(id) },
      });

      if (!laporan) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }

      if (laporan.status === "success") {
        return res.status(400).json({
          message:
            "Gagal update status, status laporan sudah success diverifikasi.",
        });
      }

      // Update status
      const updatedLaporan = await prisma.laporan.update({
        where: { id: parseInt(id) },
        data: { status },
      });

      res.status(200).json({
        message: "success update data",
        data: updatedLaporan,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }

  async deleteLapor(req, res) {
    try {
      const { id } = req.params;

      const deletedLaporan = await prisma.laporan.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({
        status: 200,
        message: "success remove laporan",
        data: deletedLaporan,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }
      console.error("Error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }

  async updateStatusLaporan(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "proses",
      "success",
      "failed",
      "laporan selesai",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    try {
      const laporan = await prisma.laporan.findUnique({
        where: { id: parseInt(id) },
      });

      if (!laporan) {
        return res.status(404).json({ message: "Laporan tidak ditemukan" });
      }

      const updatedLaporan = await prisma.laporan.update({
        where: { id: parseInt(id) },
        data: { status },
      });

      // Create notification
      const notification = await prisma.notifikasi.create({
        data: {
          user_id: laporan.user_id,
          laporan_id: laporan.id,
          title: "Update Status Laporan",
          message: `Status laporan kamu telah diperbarui menjadi: ${status}`,
        },
      });

      return res.status(200).json({
        message: "Status laporan berhasil diperbarui & notifikasi dikirim",
        data: {
          laporan: updatedLaporan,
          notification,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
}