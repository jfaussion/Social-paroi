'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { CldImage } from 'next-cloudinary';
import { updateLocationSettings, regenerateInviteToken } from '@/lib/locations/actions/manageLocation';
import { compressImage, directUploadToCloudinary } from '@/utils/clientUpload';

type Props = {
  location: {
    id: number;
    name: string;
    address: string | null;
    website: string | null;
    mapImageUrl: string | null;
  };
  inviteLink: string | null;
  locationSlug: string;
};

export default function LocationSettingsForm({ location, inviteLink: initialInviteLink, locationSlug }: Props) {
  const router = useRouter();
  const [name, setName] = useState(location.name);
  const [address, setAddress] = useState(location.address ?? '');
  const [website, setWebsite] = useState(location.website ?? '');
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(location.mapImageUrl);
  const [pendingMapFile, setPendingMapFile] = useState<File | null>(null);
  const [pendingMapPreview, setPendingMapPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [inviteLink, setInviteLink] = useState(initialInviteLink);
  const [regenerating, setRegenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    let resolvedMapImageUrl = mapImageUrl;
    if (pendingMapFile) {
      try {
        const compressed = await compressImage(pendingMapFile, { maxWidth: 1200, quality: 0.8, type: 'image/webp' });
        const result = await directUploadToCloudinary(compressed, `Locations/${locationSlug}`);
        resolvedMapImageUrl = result.publicId;
        setMapImageUrl(result.publicId);
        setPendingMapFile(null);
        setPendingMapPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch {
        toast.error('Map upload failed');
        setSaving(false);
        return;
      }
    }
    const result = await updateLocationSettings(location.id, {
      name: name || undefined,
      address: address || undefined,
      website: website || undefined,
      mapImageUrl: resolvedMapImageUrl ?? undefined,
    });
    setSaving(false);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Settings saved');
    router.refresh();
  }

  async function handleRegenerate() {
    setRegenerating(true);
    const result = await regenerateInviteToken(location.id);
    setRegenerating(false);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    const newLink = `${window.location.origin}/join/${result.inviteToken}`;
    setInviteLink(newLink);
    toast.success('Invite link regenerated');
  }

  async function handleCopy() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    toast.success('Copied to clipboard');
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Global map</label>
          <div className="flex items-center gap-4">
            {(pendingMapPreview || mapImageUrl) && (
              pendingMapPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pendingMapPreview}
                  alt="Map preview"
                  className="w-20 h-20 object-contain rounded flex-shrink-0 dark:invert"
                />
              ) : (
                <CldImage
                  src={mapImageUrl!}
                  width={80}
                  height={80}
                  crop="fit"
                  alt="Location map preview"
                  className="w-20 h-20 object-contain rounded flex-shrink-0 dark:invert"
                />
              )
            )}
            <div className="flex flex-col gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setPendingMapFile(file);
                setPendingMapPreview(file ? URL.createObjectURL(file) : null);
              }}
                className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-slate-700 dark:file:text-violet-300"
              />
              {pendingMapFile && (
                <span className="text-xs text-gray-400">Ready to upload: {pendingMapFile.name}</span>
              )}
            </div>
          </div>
        </div>
        <Button type="submit" disabled={saving} btnType="secondary">
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Invite link</h2>
        {inviteLink ? (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 text-sm truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Copy
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No invite link generated yet.</p>
        )}
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {regenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>
    </div>
  );
}
