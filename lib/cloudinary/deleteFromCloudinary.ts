import cloudinary from "./cloudinary";

export async function deleteImageFromCloudinary(imageUrl: string) {
  if (!imageUrl) {
    console.log('No Image URL');
    return;
  }
  await cloudinary.uploader.destroy(imageUrl);
  console.log('Deleted image from Cloudinary:', imageUrl);
}