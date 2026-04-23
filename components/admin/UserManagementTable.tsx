'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  setUserLocationRole,
  removeUserFromLocation,
} from '@/lib/locations/actions/manageLocationUsers';
import { LocationRole } from '@/domain/LocationRole.enum';

type Member = {
  id: number;
  userId: string;
  locationId: number;
  joinedAt: Date;
  user: { id: string; name: string | null; email: string | null; image: string | null };
  role: LocationRole | null;
};

type Props = {
  members: Member[];
  locationId: number;
  currentUserId: string | undefined;
};

export default function UserManagementTable({ members, locationId, currentUserId }: Props) {
  const router = useRouter();

  async function handleRoleChange(userId: string, value: string) {
    const role = value === '' ? null : (value as LocationRole);
    const result = await setUserLocationRole(userId, locationId, role);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('Role updated');
    router.refresh();
  }

  async function handleRemove(userId: string) {
    const result = await removeUserFromLocation(userId, locationId);
    if ('error' in result) {
      toast.error(result.error);
      return;
    }
    toast.success('User removed');
    router.refresh();
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">User</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Email</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Role</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const isSelf = member.userId === currentUserId;
            return (
              <tr
                key={member.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {member.user.image ? (
                      <Image
                        src={member.user.image}
                        alt={member.user.name ?? ''}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
                        {(member.user.name ?? '?')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium">{member.user.name ?? '—'}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {member.user.email ?? '—'}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={member.role ?? ''}
                    disabled={isSelf}
                    onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Member</option>
                    <option value="opener">Opener</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleRemove(member.userId)}
                    disabled={isSelf}
                    className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {members.length === 0 && (
        <p className="text-center py-8 text-gray-500 dark:text-gray-400">No members found.</p>
      )}
    </div>
  );
}
