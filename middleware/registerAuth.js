const admin = require("../config/adminFirebase");

const auth = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "missing token" });
    }

    const decodeToken = await admin.auth().verifyIdToken(token);

    req.token = token;
    req.user = decodeToken;

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = auth;
