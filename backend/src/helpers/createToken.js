// import { sign, verify } from "jsonwebtoken";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

import "dotenv/config";

const SECRET_KEY = process.env.SECRET_KEY || "Temporarykey";

class TokenService {
  createTokenWithExpiry(
    payload,
    expiresIn
  ) {
    try {
      const options = { expiresIn };
      return sign(payload, SECRET_KEY, options);
    } catch (error) {
      console.error("Token generation failed:", error);
      throw new Error("Failed to generate token");
    }
  }

  createAccessToken(payload) {
    return this.createTokenWithExpiry(payload, 3600); // 1 hour in seconds
  }

  createLoginToken(payload) {
    return this.createTokenWithExpiry(payload, 86400); // 24 hours in seconds
  }

  createOAuthToken(payload) {
    return this.createTokenWithExpiry(payload, 86400);
  }

  createEmailRegisterToken(payload) {
    return this.createTokenWithExpiry(payload, 3600);
  }

  createEmailToken(payload) {
    return this.createTokenWithExpiry(payload, 86400);
  }

  createResetToken(payload) {
    return this.createTokenWithExpiry(payload, 86400);
  }

  verifyEmailToken(token) {
    try {
      return verify(token, SECRET_KEY);
    } catch (error) {
      console.error("Email token verification failed:", error);
      throw new Error("Invalid or expired email token");
    }
  }
}

export const tokenService = new TokenService();
