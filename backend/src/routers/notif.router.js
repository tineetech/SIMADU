import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { NotifController } from "../controllers/notif.controller.js";


export class NotifRouter {
  router;
  notifController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.notifController = new NotifController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.notifController.getNotifs
    );

    this.router.post(
      "/create",
      this.authMiddleware.checkRole("admin"),
      this.notifController.createNotifs
    );

    this.router.post(
      "/update/:id",
      this.notifController.updateNotif,
      this.authMiddleware.checkRole('admin')
    );

    this.router.post(
      "/delete/:id",
      this.authMiddleware.checkRole("admin"),
      this.notifController.deleteNotif
    );
    this.router.get(
      "/user",
      this.authMiddleware.verifyToken,
      this.notifController.getNotifsByUserId
    );
  }

  getRouter() {
    return this.router;
  }
}
