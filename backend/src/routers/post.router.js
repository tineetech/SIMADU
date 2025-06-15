import { Router } from "express";
import multer from "multer"; //
import { AuthMiddleware } from "../middleware/auth.verify.js";
import { PostController } from "../controllers/post.controller.js";
import { ReportController } from "../controllers/report.controller.js";
import { BridgeController } from "../controllers/bridge.controller.js";
import { uploadFile } from "../middleware/Vercelblob.js"; // Pastikan di middleware ada export seperti ini

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export class PostRouter {
  router;
  authMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      // this.authMiddleware.verifyToken,
      PostController.getAllPosts
    );

    this.router.get(
      "/:id",
      // this.authMiddleware.verifyToken,
      PostController.getPostById
    );

    this.router.post(
      "/create",
      this.authMiddleware.verifyToken,
      upload.single("image"),
      async (req, res) => {
        try {
          if (req.file) {
            console.log('lolos bang')
            const mediaUrl = await uploadFile(req.file);
            req.body.media_url = mediaUrl;
          }

          await PostController.createPost(req, res);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    );

    this.router.put(
      "/:id",
      this.authMiddleware.verifyToken,
      PostController.updatePost
    );

    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      PostController.deletePost
    );

    // ======================
    // INTERACTION ROUTES
    // ======================
    this.router.post(
      "/:post_id/like",
      this.authMiddleware.verifyToken,
      BridgeController.toggleLikePost
    );

    // ======================
    // POLLING ROUTES
    // ======================
    this.router.post(
      "/:post_id/vote/:option_id",
      this.authMiddleware.verifyToken,
      PostController.votePoll
    );

    // ======================
    // COMMENT ROUTES
    // ======================
    this.router.post(
      "/:post_id/comments",
      this.authMiddleware.verifyToken,
      BridgeController.addComment
    );

    this.router.delete(
      "/:post_id/comments/:id",
      this.authMiddleware.verifyToken,
      BridgeController.deleteComment
    );

    // ======================
    // REPLIES ROUTES
    // ======================

    this.router.post(
      "/comments/:comment_id/replies",
      this.authMiddleware.verifyToken,
      BridgeController.addReply
    );

    this.router.get(
      "/comments/:comment_id/replies",
      BridgeController.getReplies
    );

    this.router.delete(
      "/replies/:id",
      this.authMiddleware.verifyToken,
      BridgeController.deleteReply
    );

    // ======================
    // REPORT ROUTES
    // ======================
    this.router.post(
      "/:post_id/report",
      this.authMiddleware.verifyToken,
      ReportController.reportPost
    );

    this.router.get(
      "/:post_id/reports",
      this.authMiddleware.verifyToken,
      ReportController.getPostReports
    );

    // ======================
    // ADMIN-ONLY REPORT ROUTES
    // ======================
    this.router.get(
      "/reports/all",
      this.authMiddleware.verifyToken,
      ReportController.getAllReports
    );

    this.router.patch(
      "/reports/:report_id/status",
      this.authMiddleware.verifyToken,
      ReportController.updateReportStatus
    );
  }

  getRouter() {
    return this.router;
  }
}
