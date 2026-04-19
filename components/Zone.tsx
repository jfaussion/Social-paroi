import Image from "next/image";

interface ZoneProps {
  miniMapUrl?: string | null;
  zoneName?: string;
  height?: number;
  width?: number;
  className?: string;
}

export function Zone({ miniMapUrl, zoneName, height, width, className }: ZoneProps) {
  if (!miniMapUrl) return null;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const src = miniMapUrl.startsWith('http')
    ? miniMapUrl
    : `https://res.cloudinary.com/${cloudName}/image/upload/${miniMapUrl}`;

  return (
    <Image
      src={src}
      alt={zoneName ?? 'Zone map'}
      width={width ?? 60}
      height={height ?? 50}
      unoptimized
      className={`dark:invert ${className ?? ''}`}
    />
  );
}
