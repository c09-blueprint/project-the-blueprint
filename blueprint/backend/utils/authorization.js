import { auth } from "express-oauth2-jwt-bearer";
import { User } from "../models/user.js";

export const userExtractor = async (req, res, next) => {
  /* Verify token. */
  auth({
    audience: "http://localhost:3001",
    issuerBaseURL: "https://dev-jcol6i3ol3vahmwd.us.auth0.com/",
    tokenSigningAlg: "RS256",
  });

  /* Create a user for new user. */
  const userEmail = req.get("userEmail");
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
  }

  next();
};
