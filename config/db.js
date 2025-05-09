const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("DB CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log(error);
  }
};

module.exports = db;
