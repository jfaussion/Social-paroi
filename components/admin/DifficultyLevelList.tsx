'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createDifficultyLevel,
  updateDifficultyLevel,
  reorderDifficultyLevels,
  deleteDifficultyLevel,
} from '@/lib/locations/actions/manageDifficultyLevels';

type DifficultyLevel = {
  id: number;
  name: string;
  color: string | null;
  order: number;
};

type Props = {
  levels: DifficultyLevel[];
  locationId: number;
};

export default function DifficultyLevelList({ levels: initialLevels, locationId }: Props) {
  const router = useRouter();
  const [levels, setLevels] = useState<DifficultyLevel[]>(initialLevels);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('');
  const [deleteErrors, setDeleteErrors] = useState<Partial<Record<number, string>>>({});
  const editInputRef = useRef<HTMLInputElement>(null);

  async function handleReorder(orderedIds: number[]) {
    const result = await reorderDifficultyLevels(locationId, orderedIds);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  async function moveLevel(index: number, direction: 'up' | 'down') {
    const newLevels = [...levels];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newLevels.length) return;
    [newLevels[index], newLevels[swapIndex]] = [newLevels[swapIndex], newLevels[index]];
    setLevels(newLevels);
    await handleReorder(newLevels.map((l) => l.id));
  }

  function startEdit(level: DifficultyLevel) {
    setEditingId(level.id);
    setEditName(level.name);
    setEditColor(level.color ?? '');
    setTimeout(() => editInputRef.current?.focus(), 0);
  }

  async function saveEdit(id: number) {
    if (!editName.trim()) return;
    const result = await updateDifficultyLevel(id, {
      name: editName.trim(),
      color: editColor.trim() || undefined,
    });
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Difficulty level updated');
    setLevels((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, name: editName.trim(), color: editColor.trim() || null } : l
      )
    );
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: number) {
    setDeleteErrors((prev) => { const next = { ...prev }; next[id] = ''; return next; });
    const result = await deleteDifficultyLevel(id);
    if ('error' in result) {
      setDeleteErrors((prev) => { const next = { ...prev }; next[id] = result.error; return next; });
      return;
    }
    toast.success('Difficulty level deleted');
    setLevels((prev) => prev.filter((l) => l.id !== id));
    router.refresh();
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    const result = await createDifficultyLevel(locationId, {
      name: newName.trim(),
      color: newColor.trim() || undefined,
    });
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Difficulty level created');
    setNewName('');
    setNewColor('');
    router.refresh();
  }

  return (
    <div className="w-full max-w-lg space-y-2">
      <ul className="space-y-2">
        {levels.map((level, index) => (
          <li key={level.id} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
            <span
              className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-300"
              style={{ backgroundColor: level.color ?? '#ccc' }}
            />
            {editingId === level.id ? (
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(level.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 px-2 py-1 border border-gray-400 rounded dark:bg-gray-700 text-sm"
                  />
                  <input
                    type="color"
                    value={editColor || '#cccccc'}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    title="Pick color"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(level.id)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
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
              <button
                className="flex-1 text-left text-sm font-medium hover:underline"
                onClick={() => startEdit(level)}
              >
                {level.name}
              </button>
            )}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => moveLevel(index, 'up')}
                disabled={index === 0}
                className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-30 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Move up"
              >
                &#8593;
              </button>
              <button
                onClick={() => moveLevel(index, 'down')}
                disabled={index === levels.length - 1}
                className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-30 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Move down"
              >
                &#8595;
              </button>
              <button
                onClick={() => handleDelete(level.id)}
                className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                aria-label="Delete"
              >
                Delete
              </button>
            </div>
            {deleteErrors[level.id] && (
              <p className="text-xs text-red-500 w-full mt-1">{deleteErrors[level.id]}</p>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          placeholder="New level name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 text-sm"
        />
        <input
          type="color"
          value={newColor || '#cccccc'}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-gray-300 p-0"
          title="Pick color"
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  );
}
