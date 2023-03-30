import { auth } from "express-oauth2-jwt-bearer";
import { User } from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

export const userExtractor = async (req, res, next) => {
  /* Verify token. */
  auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
  });

  /* Create a user in database for new user. */
  const userEmail = req.get("UserEmail");
  const findUser = await User.findOne({
    where: {
      email: userEmail,
    },
  });
  if (!findUser) {
    const user = User.build({
      email: userEmail,
    });
    try {
      await user.save();
    } catch {
      return res.status(500).json({ error: "User creation failed." });
    }
    req.user = user;
  } else {
    req.user = findUser;
  }

  next();
};
