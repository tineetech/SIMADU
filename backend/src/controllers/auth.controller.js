import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { tokenService } from "../helpers/createToken.js";
import {
  sendResetPassEmail,
  sendVerificationEmail,
} from "../services/mailer.js";
import { hashPass } from "../helpers/hashpassword.js";
import verifyGoogleToken from "../services/Oauth.js";
import { prisma } from "../services/db.js"; // Changed from supabase to prisma

const JWT_SECRET = process.env.SECRET_KEY || "osdjfksdhfishd";

export class AuthController {
  async registerGuest(req, res) {
    const { email, password, username, avatar } = req.body;

    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await hashPass(password);

      // Create new user with Prisma transaction to ensure both user and koin are created
      const newUser = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            username,
            avatar:
              avatar ||
              "https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg",
            role: "guest",
          },
        });

        // Create default coins
        await prisma.koin.create({
          data: {
            user_id: user.user_id,
            amount: 0,
          },
        });

        return user;
      });

      return res
        .status(201)
        .json({ message: "Register success, please login" });
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async loginAny(req, res) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = tokenService.createLoginToken({
        id: user.user_id,
        role: user.role,
      });

      res.status(200).json({
        message: "success login",
        token,
        results: {
          ...user,
          phone: user.phone?.toString(), // ubah phone ke string jika ada
        },
      });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async loginAdmin(req, res) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
          role: "admin",
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Your account is not admin" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = tokenService.createLoginToken({
        id: user.user_id,
        role: user.role,
      });

      res.status(200).json({
        message: "success login",
        token,
        results: {
          ...user,
          phone: user.phone?.toString(), // ubah phone ke string jika ada
        },
      });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async resetPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = tokenService.createResetToken({
        id: user.user_id,
        role: user.role,
        resetPassword: user.password,
      });

      await prisma.user.update({
        where: { user_id: user.user_id },
        data: { password_reset_token: token },
      });

      await sendResetPassEmail(email, token);

      return res.status(201).json({
        status: "success",
        token: token,
        message:
          "Reset Password Link sent successfully. Please check your email for verification.",
        user,
      });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async cekResetToken(req, res) {
    const { token } = req.body;

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      const user = await prisma.user.findUnique({
        where: { user_id: decodedToken.id },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (user.password_reset_token == null) {
        return res.status(250).json({ message: "token tidak tersedia" });
      }

      if (user.password_reset_token === token) {
        return res.status(200).json({ message: "token tersedia" });
      }

      return res.status(200).json({ message: "token tersedia" });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyResetPassword(req, res) {
    const { password, confirmPassword } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized, where your reset token?" });
      }

      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const user = await prisma.user.findFirst({
        where: {
          user_id: decodedToken.id,
          password_reset_token: token,
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid credentials or Reset token is empty on db",
        });
      }

      const hashedPassword = await hashPass(password);

      await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          password: hashedPassword,
          password_reset_token: null,
        },
      });

      return res.status(201).json({
        status: "success",
        message: "Reset Password successfully. Please login.",
        user,
      });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async googleRegister(req, res) {
    const { idToken } = req.body;

    try {
      const { email, name, picture, email_verified } = await verifyGoogleToken(
        idToken
      );

      if (!email_verified) {
        return res
          .status(400)
          .json({ message: "Email not verified by Google" });
      }

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // User doesn't exist, create new
        user = await prisma.user.create({
          data: {
            email,
            role: "guest",
            username: name,
            avatar: picture,
          },
        });
      }

      const token = tokenService.createLoginToken({
        id: user.user_id,
        role: user.role,
      });

      res.status(200).json({
        message: "Success login",
        token,
        user,
      });
    } catch (err) {
      console.error("Error verifying Google token:", err);
      res.status(401).json({ message: "Invalid Google token" });
    }
  }

  async me(req, res) {
    try {
      if (!req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { user_id: req.user.id },
        include: {
          Koin: true, 
        },
      });

      res.status(200).json({ results: user });
    } catch (err) {
      console.error("DB Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
