import { v2 as cloudinary } from "cloudinary";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export type ImageUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadPortfolioImage(
  file: File
): Promise<ImageUploadResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { ok: false, error: "Image must be a JPG, PNG, or WEBP file." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "Image must be smaller than 5MB." };
  }

  if (!isCloudinaryConfigured()) {
    return {
      ok: false,
      error: "Image upload is not configured. Enter an Image URL instead.",
    };
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "portfolio",
      resource_type: "image",
    });

    return { ok: true, url: result.secure_url };
  } catch {
    return {
      ok: false,
      error: "Image upload failed. Please try again or use an Image URL.",
    };
  }
}
