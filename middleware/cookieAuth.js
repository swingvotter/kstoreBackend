// middleware/auth.js
const admin = require("../config/adminFirebase");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ success: false, message: "Missing token" });
    }

    const decodeToken = await admin.auth().verifyIdToken(token);
    req.user = decodeToken;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = auth;
