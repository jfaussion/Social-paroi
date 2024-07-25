'use server';
import { UploadApiOptions } from 'cloudinary';
import { mkdir, unlink, writeFile } from 'fs/promises';
import fs from 'fs';
import cloudinary from './cloudinary';

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!file) {
    console.log('No File');
    return '';
  }

  // Create tmp folder if it doesn't exist
  if (!fs.existsSync('/tmp')) {
    console.log('createdir path');
    await mkdir('/tmp');
  }

  // Write file to tmp folder
  const path = `/tmp/${file.name}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path, buffer);

  // Upload image to Cloudinary
  const result = await cloudinary.uploader.upload(path, {
    folder: 'SocialParoiApp/Tracks/',
  } as UploadApiOptions);
  const uploadedImageUrl = result.public_id;
  console.log('Uploaded image to Cloudinary:', uploadedImageUrl);

  // Delete the file after it has been uploaded
  await unlink(path);
  console.log('Deleted file:', path);

  return uploadedImageUrl;
}