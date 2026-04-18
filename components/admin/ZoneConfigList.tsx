'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CldImage } from 'next-cloudinary';
import {
  createZone,
  updateZone,
  reorderZones,
  deleteZone,
  getTracksCountByZone,
} from '@/lib/locations/actions/manageZones';
import ZoneDeleteDialog from '@/components/admin/ZoneDeleteDialog';
import { compressImage, directUploadToCloudinary } from '@/utils/clientUpload';

type Zone = {
  id: number;
  name: string;
  order: number;
  miniMapUrl: string | null;
};

type Props = {
  zones: Zone[];
  locationId: number;
  locationSlug: string;
};

export default function ZoneConfigList({ zones: initialZones, locationId, locationSlug }: Props) {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editMiniMapUrl, setEditMiniMapUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    zone: Zone;
    trackCount: number;
  } | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleReorder(orderedIds: number[]) {
    const result = await reorderZones(locationId, orderedIds);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  async function moveZone(index: number, direction: 'up' | 'down') {
    const newZones = [...zones];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newZones.length) return;
    [newZones[index], newZones[swapIndex]] = [newZones[swapIndex], newZones[index]];
    setZones(newZones);
    await handleReorder(newZones.map((z) => z.id));
  }

  function startEdit(zone: Zone) {
    setEditingId(zone.id);
    setEditName(zone.name);
    setEditMiniMapUrl(zone.miniMapUrl);
    setTimeout(() => editInputRef.current?.focus(), 0);
  }

  async function handleMiniMapFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 800, quality: 0.8, type: 'image/webp' });
      const result = await directUploadToCloudinary(compressed, `Zones/${locationSlug}`);
      setEditMiniMapUrl(result.publicId);
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function saveEdit(id: number) {
    if (!editName.trim()) return;
    const result = await updateZone(id, {
      name: editName.trim(),
      miniMapUrl: editMiniMapUrl ?? undefined,
    });
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Zone updated');
    setZones((prev) =>
      prev.map((z) =>
        z.id === id ? { ...z, name: editName.trim(), miniMapUrl: editMiniMapUrl } : z
      )
    );
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(zone: Zone) {
    const trackCount = await getTracksCountByZone(zone.id);
    if (trackCount > 0) {
      setDeleteDialog({ zone, trackCount });
      return;
    }
    const result = await deleteZone(zone.id, null);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Zone deleted');
    setZones((prev) => prev.filter((z) => z.id !== zone.id));
    router.refresh();
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    const result = await createZone(locationId, { name: newName.trim() });
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Zone created');
    setNewName('');
    router.refresh();
  }

  return (
    <div className="w-full max-w-lg space-y-2">
      <ul className="space-y-2">
        {zones.map((zone, index) => (
          <li key={zone.id} className="flex flex-col gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
            <div className="flex items-center gap-3">
              {editingId === zone.id ? (
                <div className="flex flex-col gap-2 flex-1">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(zone.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    placeholder="Zone name"
                    className="flex-1 px-2 py-1 border border-gray-400 rounded dark:bg-gray-700 text-sm"
                  />
                  <div className="flex items-center gap-3">
                    {editMiniMapUrl && (
                      <CldImage
                        src={editMiniMapUrl}
                        width={60}
                        height={60}
                        crop="fit"
                        alt="Mini map preview"
                        className="w-12 h-12 object-contain rounded flex-shrink-0 dark:invert"
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Mini-map image</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleMiniMapFileChange}
                        disabled={isUploading}
                        className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-slate-700 dark:file:text-violet-300 disabled:opacity-50"
                      />
                      {isUploading && <span className="text-xs text-gray-400">Uploading…</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(zone.id)}
                      disabled={isUploading}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {zone.miniMapUrl && (
                    <CldImage
                      src={zone.miniMapUrl}
                      width={60}
                      height={60}
                      crop="fit"
                      alt={`${zone.name} mini map`}
                      className="w-10 h-10 object-contain rounded flex-shrink-0 dark:invert"
                    />
                  )}
                  <button
                    className="flex-1 text-left text-sm font-medium hover:underline truncate"
                    onClick={() => startEdit(zone)}
                  >
                    {zone.name}
                  </button>
                </div>
              )}
              {editingId !== zone.id && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveZone(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-30 hover:bg-gray-300 dark:hover:bg-gray-600"
                    aria-label="Move up"
                  >
                    &#8593;
                  </button>
                  <button
                    onClick={() => moveZone(index, 'down')}
                    disabled={index === zones.length - 1}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-30 hover:bg-gray-300 dark:hover:bg-gray-600"
                    aria-label="Move down"
                  >
                    &#8595;
                  </button>
                  <button
                    onClick={() => handleDelete(zone)}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                    aria-label="Delete"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          placeholder="New zone name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {deleteDialog && (
        <ZoneDeleteDialog
          zone={deleteDialog.zone}
          trackCount={deleteDialog.trackCount}
          otherZones={zones.filter((z) => z.id !== deleteDialog.zone.id)}
          onClose={() => setDeleteDialog(null)}
          onDeleted={() => {
            setDeleteDialog(null);
            setZones((prev) => prev.filter((z) => z.id !== deleteDialog.zone.id));
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
