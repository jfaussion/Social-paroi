'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createLocation, publishLocation, hideLocation } from '@/lib/locations/actions/manageLocation';
import { Button } from '@/components/ui/Button';
import { LocationStatus } from '@/domain/LocationStatus.enum';

type LocationItem = {
  id: number;
  name: string;
  slug: string | null;
  status: string;
  type: string;
};

type Props = {
  locations: LocationItem[];
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function SuperAdminLocationsPanel({ locations }: Props) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [type, setType] = useState<'gym' | 'outdoor'>('gym');
  const [slug, setSlug] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(slugify(value));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const result = await createLocation({
      name,
      type,
      slug,
      address: address || undefined,
      website: website || undefined,
    });
    setCreating(false);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Location created');
    setName('');
    setType('gym');
    setSlug('');
    setAddress('');
    setWebsite('');
    setShowForm(false);
    router.refresh();
  }

  async function handleToggle(loc: LocationItem) {
    setTogglingId(loc.id);
    const result =
      loc.status === LocationStatus.published
        ? await hideLocation(loc.id)
        : await publishLocation(loc.id);
    setTogglingId(null);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success(loc.status === LocationStatus.published ? 'Location hidden' : 'Location published');
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        {locations.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No locations yet.</p>
        ) : (
          locations.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{loc.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    loc.status === LocationStatus.published
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {loc.status === LocationStatus.published ? 'Published' : 'Hidden'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {loc.slug && (
                  <Link
                    href={`/${loc.slug}/admin`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => handleToggle(loc)}
                  disabled={togglingId === loc.id}
                  className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {togglingId === loc.id
                    ? '...'
                    : loc.status === LocationStatus.published
                    ? 'Hide'
                    : 'Publish'}
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <section>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 w-full justify-center transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Add location
          </button>
        ) : (
          <div className="rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">New location</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="loc-name">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="loc-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="loc-type">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="loc-type"
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value as 'gym' | 'outdoor')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="gym">Gym</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="loc-slug">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="loc-slug"
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="loc-address">
                  Address
                </label>
                <input
                  id="loc-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="loc-website">
                  Website
                </label>
                <input
                  id="loc-website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                />
              </div>
              <Button type="submit" btnType="secondary" disabled={creating}>
                {creating ? 'Creating...' : 'Create location'}
              </Button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
