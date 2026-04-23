'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import {
  createHoldColor,
  updateHoldColor,
  reorderHoldColors,
  deleteHoldColor,
} from '@/lib/locations/actions/manageHoldColors';

type HoldColor = {
  id: number;
  name: string;
  color: string;
  order: number;
};

type Props = {
  holdColors: HoldColor[];
  locationId: number;
};

function isValidHex(val: string) {
  return /^#[0-9a-fA-F]{6}$/.test(val);
}

export default function HoldColorList({ holdColors: initialHoldColors, locationId }: Props) {
  const router = useRouter();
  const [holdColors, setHoldColors] = useState<HoldColor[]>(initialHoldColors);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editHexInput, setEditHexInput] = useState('');
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#cccccc');
  const [newHexInput, setNewHexInput] = useState('#cccccc');
  const [deleteErrors, setDeleteErrors] = useState<Partial<Record<number, string>>>({});
  const editInputRef = useRef<HTMLInputElement>(null);

  async function handleReorder(orderedIds: number[]) {
    const result = await reorderHoldColors(locationId, orderedIds);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  async function moveColor(index: number, direction: 'up' | 'down') {
    const newColors = [...holdColors];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newColors.length) return;
    [newColors[index], newColors[swapIndex]] = [newColors[swapIndex], newColors[index]];
    setHoldColors(newColors);
    await handleReorder(newColors.map((c) => c.id));
  }

  function startEdit(color: HoldColor) {
    setEditingId(color.id);
    setEditName(color.name);
    setEditColor(color.color);
    setEditHexInput(color.color);
    setTimeout(() => editInputRef.current?.focus(), 0);
  }

  function handleEditColorPickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditColor(e.target.value);
    setEditHexInput(e.target.value);
  }

  function handleEditHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setEditHexInput(val);
    if (isValidHex(val)) {
      setEditColor(val);
    }
  }

  function handleEditHexInputBlur() {
    if (!isValidHex(editHexInput)) {
      setEditHexInput(editColor);
    } else {
      setEditColor(editHexInput);
    }
  }

  async function saveEdit(id: number) {
    if (!editName.trim()) return;
    const result = await updateHoldColor(id, {
      name: editName.trim(),
      color: editColor,
    });
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Hold color updated');
    setHoldColors((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name: editName.trim(), color: editColor } : c
      )
    );
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: number) {
    setDeleteErrors((prev) => { const next = { ...prev }; next[id] = ''; return next; });
    const result = await deleteHoldColor(id);
    if ('error' in result) {
      setDeleteErrors((prev) => { const next = { ...prev }; next[id] = result.error; return next; });
      toast.error(result.error);
      return;
    }
    toast.success('Hold color deleted');
    setHoldColors((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    const result = await createHoldColor(locationId, { name: newName.trim(), color: newColor });
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Hold color created');
    setHoldColors((prev) => [...prev, result]);
    setNewName('');
    setNewColor('#cccccc');
    setNewHexInput('#cccccc');
    router.refresh();
  }

  function handleNewColorPickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewColor(e.target.value);
    setNewHexInput(e.target.value);
  }

  function handleNewHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setNewHexInput(val);
    if (isValidHex(val)) {
      setNewColor(val);
    }
  }

  function handleNewHexInputBlur() {
    if (!isValidHex(newHexInput)) {
      setNewHexInput(newColor);
    } else {
      setNewColor(newHexInput);
    }
  }

  return (
    <div className="w-full max-w-lg space-y-2">
      <ul className="space-y-2">
        {holdColors.map((color, index) => (
          <li key={color.id} className="flex flex-col gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-300"
                style={{ backgroundColor: color.color }}
              />
              {editingId === color.id ? (
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(color.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="flex-1 px-2 py-1 border border-gray-400 rounded dark:bg-gray-700 text-sm"
                    />
                    <input
                      type="color"
                      value={editColor}
                      onChange={handleEditColorPickerChange}
                      className="w-8 h-8 rounded cursor-pointer bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 p-0"
                      title="Pick color"
                    />
                    <input
                      type="text"
                      value={editHexInput}
                      onChange={handleEditHexInputChange}
                      onBlur={handleEditHexInputBlur}
                      maxLength={7}
                      placeholder="#rrggbb"
                      className="w-20 px-2 py-1 border border-gray-400 rounded dark:bg-gray-700 text-xs font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveEdit(color.id)}
                      btnType="secondary"
                      className="!h-auto px-3 py-1 text-xs"
                    >
                      Save
                    </Button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    className="flex-1 text-left text-sm font-medium hover:underline"
                    onClick={() => startEdit(color)}
                  >
                    {color.name}
                  </button>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => moveColor(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-30 hover:bg-gray-300 dark:hover:bg-gray-600"
                      aria-label="Move up"
                    >
                      &#8593;
                    </button>
                    <button
                      onClick={() => moveColor(index, 'down')}
                      disabled={index === holdColors.length - 1}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-30 hover:bg-gray-300 dark:hover:bg-gray-600"
                      aria-label="Move down"
                    >
                      &#8595;
                    </button>
                    <button
                      onClick={() => handleDelete(color.id)}
                      className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                      aria-label="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
            {deleteErrors[color.id] && (
              <p className="text-xs text-red-500 w-full">{deleteErrors[color.id]}</p>
            )}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="New color name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 text-sm"
          />
          <input
            type="color"
            value={newColor}
            onChange={handleNewColorPickerChange}
            className="w-8 h-8 rounded cursor-pointer bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-0"
            title="Pick color"
          />
          <input
            type="text"
            value={newHexInput}
            onChange={handleNewHexInputChange}
            onBlur={handleNewHexInputBlur}
            maxLength={7}
            placeholder="#rrggbb"
            className="w-20 px-2 py-1 border border-gray-300 rounded dark:bg-gray-800 text-xs font-mono"
          />
        </div>
        <Button onClick={handleAdd} disabled={!newName.trim()} btnType="secondary">
          Add
        </Button>
      </div>
    </div>
  );
}