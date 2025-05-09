const express = require("express");
const router = express.Router();
const { loginUser, logoutUser } = require("../controller/user");
const registerAuth = require("../middleware/registerAuth");
const cookieAuth = require("../middleware/cookieAuth");

router.post("/login", registerAuth, loginUser);
router.get("/logout", cookieAuth, logoutUser);
router.get("/me", cookieAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user, // Contains uid, email, name, etc.
  });
});

module.exports = router;
