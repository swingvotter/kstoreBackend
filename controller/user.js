const User = require("../model/user");

const loginUser = async (req, res) => {
  const { user_id, name, email, picture } = req.user;

  if (!user_id || !name || !email || !picture) {
    return res
      .status(200)
      .json({ success: false, message: "all field must be provided" });
  }

  try {
    let user = await User.findOne({ user_id });

    if (!user) {
      user = await User.create({
        user_id,
        name,
        email,
        picture,
      });
    }

    res.cookie("jwt", req.token, {
      httpOnly: true,
      secure: true,
      sameSite:"none"
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "user login successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite:"none"
    });
    return res
      .status(200)
      .json({ success: true, message: "user logout successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { loginUser, logoutUser };
