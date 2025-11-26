'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserType = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isEditor: boolean;
};

export default function MembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Access control
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.isAdmin && !session?.user?.isEditor) {
      router.push('/');
    }
  }, [session, status, router]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (
    id: string,
    role: 'isAdmin' | 'isEditor',
    value: boolean
  ) => {
    const user = users.find((u) => u._id === id);

    // Prevent undefined spread error
    if (!user) {
      console.error('User not found:', id);
      return;
    }

    const updatedUser = { ...user, [role]: value };

    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        isAdmin: updatedUser.isAdmin,
        isEditor: updatedUser.isEditor,
      }),
    });

    const updated = await res.json();

    // Update UI safely
    setUsers((prev) =>
      prev.map((u) => (u._id === updated._id ? updated : u))
    );
  };

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/admin-dashboard"
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Member Directory</h1>

      <table className="w-full bg-white border shadow rounded-lg">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Admin</th>
            <th className="p-3">Editor</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t hover:bg-gray-50">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                {session?.user?.isAdmin ? (
                  <input
                    type="checkbox"
                    checked={user.isAdmin}
                    onChange={(e) =>
                      handleRoleChange(user._id, 'isAdmin', e.target.checked)
                    }
                  />
                ) : (
                  <span>{user.isAdmin ? 'Yes' : 'No'}</span>
                )}
              </td>
              <td className="p-3">
                {session?.user?.isAdmin ? (
                  <input
                    type="checkbox"
                    checked={user.isEditor}
                    onChange={(e) =>
                      handleRoleChange(user._id, 'isEditor', e.target.checked)
                    }
                  />
                ) : (
                  <span>{user.isEditor ? 'Yes' : 'No'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
