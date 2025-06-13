import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { UsersController } from "../controllers/users.controller.js";

export class UsersRouter {
  router;
  usersController;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.usersController = new UsersController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.usersController.getUsers,
      this.authMiddleware.verifyToken
    );

    this.router.get(
      "/:id",
      this.usersController.getUserById,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/create",
      this.usersController.createUsers,
      this.authMiddleware.checkRole('admin')
    );

    this.router.post(
      "/update/:id",
      this.usersController.updateUsersPublic,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/delete/:id",
      this.usersController.deleteUsers,
      this.authMiddleware.checkRole('admin')
    );

    this.router.get(
      "/koin",
      this.usersController.getKoins,
      this.authMiddleware.verifyToken
    );

    this.router.get(
      "/koin/:id",
      this.usersController.getKoinById,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/koin/create",
      this.usersController.createKoin,
      this.authMiddleware.checkRole('admin')
    );
    
    this.router.get(
      "/koin/penukaran",
      this.authMiddleware.verifyToken,
      this.usersController.getTrxKoin,
    );

    this.router.post(
      "/koin/request-penukaran/",
      this.authMiddleware.verifyToken,
      this.usersController.createTrxKoin,
    );

    this.router.post(
      "/koin/bayar-penukaran/",
      this.authMiddleware.checkRole('admin'),
      this.usersController.createKoin,
    );

    this.router.post(
      "/koin/update/:id",
      this.usersController.updateKoin,
      this.authMiddleware.verifyToken
    );

    this.router.post(
      "/koin/delete/:id",
      this.usersController.deleteKoin,
      this.authMiddleware.checkRole('admin')
    );
  }

  getRouter() {
    return this.router;
  }
}

