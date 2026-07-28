import cloudinary from "../config/cloudinary.js";

export const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "profile_images",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteImage = (publicId)=> {
  return cloudinary.uploader.destroy(publicId)
}
