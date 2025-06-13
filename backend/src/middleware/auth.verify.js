import { responseError } from "../helpers/responseError.js";
// import { decode, TokenExpiredError, verify } from "jsonwebtoken";
import pkg from 'jsonwebtoken';
const { decode, TokenExpiredError, verify } = pkg;


export class AuthMiddleware {
  verifyToken(req, res, next) {
    try {
      let token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) throw "Verification Failed";

      const user = verify(token, process.env.SECRET_KEY);
      req.user = user;

      next();
    } catch (error) {
      responseError(res, error);
    }
  }
  
  verifyExpiredToken(req, res, next) {
    try {
      let token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) throw "Verification Failed";

      const user = verify(token, process.env.SECRET_KEY);

      // Validasi manual token expired
      if (user.exp && Date.now() >= user.exp * 86400) {
        throw new TokenExpiredError("Token expired", new Date(user.exp * 86400));
      }

      req.user = { id: user.id, role: user.role };
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return res.status(300);
      } else {
        return res.status(200);
      }
    }
  }

  checkRole(role) {
    return (req, res, next) => {
      try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) throw "Verification Failed";
        const decoded = decode(token);
        if (typeof decoded !== "string" && decoded && decoded.role === role) {
          next();
        } else {
          throw `You Are Not Authorized! Required role: ${role}`;
        }
      } catch (error) {
        responseError(res, error);
      }
    };
  }

  isSuperAdmin = this.checkRole("super_admin");
  checkStrAdmin = this.checkRole("store_admin");
  checkSuperAdmin = this.checkRole("super_admin");
}
