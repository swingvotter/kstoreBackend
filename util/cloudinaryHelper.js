const cloudinary = require("../config/cloudinary");

const cloudinaryUploader = async (filePath) => {
  try {
    return await cloudinary.uploader.upload(filePath);
  } catch (error) {
    console.log(error);
  }
};

const cloudinaryDeleter = async (public_id) => {
  try {
    return await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { cloudinaryUploader, cloudinaryDeleter };
