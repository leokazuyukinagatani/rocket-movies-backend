const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

class DiskStorage {
  async saveFile(file, user) {
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOAD_FOLDER, file)
    );

    const response = await cloudinary.uploader.upload(
      path.resolve(uploadConfig.UPLOAD_FOLDER, file),
      {
        tags: "basic_sample",
        public_id: `${user.name}-${user.id}`,
        width: 250,
        height: 250,
        crop: "fit",
      },

      function (err, image) {
        console.log();
        console.log("** File Upload");
        if (err) {
          console.warn(err);
        }
        console.log(
          "* public_id for the uploaded image is generated by Cloudinary's service."
        );
        console.log("* " + image.public_id);
        console.log("* " + image.url);
      }
    );

    await this.deleteFile(file);
    console.log(response);
    return response.url;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOAD_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
