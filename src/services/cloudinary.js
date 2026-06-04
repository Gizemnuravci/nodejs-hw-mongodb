import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import createHttpError from 'http-errors';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'contacts_photos',
    });

    await fs.unlink(filePath).catch(() => {});

    return result.secure_url;
  } catch {
    await fs.unlink(filePath).catch(() => {});
    throw createHttpError(500, 'Failed to upload image, please try again later.');
  }
};
