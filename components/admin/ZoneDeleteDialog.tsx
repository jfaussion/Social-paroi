'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteZone } from '@/lib/locations/actions/manageZones';

type Zone = { id: number; name: string };

type Props = {
  zone: Zone;
  trackCount: number;
  otherZones: Zone[];
  onClose: () => void;
  onDeleted: () => void;
};

export default function ZoneDeleteDialog({ zone, trackCount, otherZones, onClose, onDeleted }: Props) {
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(
    otherZones.length > 0 ? otherZones[0].id : null
  );
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    const result = await deleteZone(zone.id, selectedZoneId);
    setLoading(false);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Zone deleted');
    onDeleted();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
        <h2 className="text-lg font-semibold">Delete Zone</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Zone &quot;{zone.name}&quot; has {trackCount} track(s). Select a zone to migrate them to:
        </p>
        <select
          value={selectedZoneId ?? ''}
          onChange={(e) => setSelectedZoneId(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 text-sm"
        >
          {otherZones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || selectedZoneId === null}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-40"
          >
            Delete & Migrate
          </button>
        </div>
      </div>
    </div>
  );
}
