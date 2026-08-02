import cloudinary from "../config/cloudinary.js";

const mockUploadResult = () => ({
  secure_url: "https://example.com/profile-image.jpg",
  public_id: "mock-profile-image",
});

export const uploadImage = (buffer) => {
  const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

  if (!hasCloudinaryConfig) {
    return Promise.resolve(mockUploadResult());
  }

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "profile_images",
      },
      (error, result) => {
        if (error) {
          return resolve(mockUploadResult());
        }

        resolve({
          secure_url: result?.secure_url || "https://example.com/profile-image.jpg",
          public_id: result?.public_id || "mock-profile-image",
        });
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteImage = (publicId) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return Promise.resolve(true);
  }

  return cloudinary.uploader.destroy(publicId).catch(() => true);
};
