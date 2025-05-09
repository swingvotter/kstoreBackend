const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: { type: String },
  name: { type: String },
  email: { type: String },
  picture: { type: String },
});

const user = mongoose.model("user", userSchema);
module.exports = user;
