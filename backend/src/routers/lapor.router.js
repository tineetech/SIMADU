import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { LaporController } from "../controllers/lapor.controller.js";
import { upload } from "../middleware/multer.js";

export class LaporRouter {
  router;
  laporController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.laporController = new LaporController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/analisis-ai",
      this.authMiddleware.verifyToken,
      upload.single("file"),
      this.laporController.analisisWithAi,
    );

    this.router.get(
      "/",
      this.laporController.getLapor,
      // this.authMiddleware.verifyToken
    );
    
    this.router.post(
      "/create",
      this.authMiddleware.verifyToken,
      upload.single("file"),
      this.laporController.createLapor
    );

    this.router.post(
      "/update-status/:id",
      this.authMiddleware.verifyToken,
      this.laporController.updateStatus,
    );

     this.router.post(
      "/status/:id",
      this.laporController.updateStatusLaporan,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/delete/:id",
      this.laporController.deleteLapor,
      this.authMiddleware.checkRole('admin')
    );
  }

  getRouter() {
    return this.router;
  }
}

