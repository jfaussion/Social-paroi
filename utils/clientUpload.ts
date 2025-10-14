'use client';

export type DirectUploadResult = {
  publicId: string;
  secureUrl: string;
};

async function getSignature(folder: string) {
  const res = await fetch('/api/uploads/cloudinary-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  });
  if (!res.ok) throw new Error('Failed to get upload signature');
  return res.json() as Promise<{
    cloudName: string;
    apiKey: string;
    signature: string;
    timestamp: number;
    uploadPreset: string;
    folder: string;
  }>;
}

export async function compressImage(file: File, opts?: { maxWidth?: number; quality?: number; type?: 'image/webp' | 'image/jpeg' | 'image/png'; }): Promise<Blob> {
  const maxWidth = opts?.maxWidth ?? 1600;
  const quality = opts?.quality ?? 0.8;
  const outputType = opts?.type ?? 'image/webp';

  const img = document.createElement('img');
  const objectUrl = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve as any;
      img.onerror = reject as any;
      img.src = objectUrl;
    });
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const targetWidth = Math.round(img.naturalWidth * scale);
    const targetHeight = Math.round(img.naturalHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality));
    if (!blob) throw new Error('Compression failed');
    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function directUploadToCloudinary(fileOrBlob: File | Blob, folder: string): Promise<DirectUploadResult> {
  const sig = await getSignature(folder);
  const form = new FormData();
  form.append('file', fileOrBlob);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', String(sig.timestamp));
  form.append('signature', sig.signature);
  form.append('folder', sig.folder);
  form.append('upload_preset', sig.uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const json = await res.json();
  return { publicId: json.public_id as string, secureUrl: json.secure_url as string };
}


