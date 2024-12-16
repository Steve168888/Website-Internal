import Link from "next/link";

// Tipe Data User
interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  created_at: string;
}

const User = () => {
  // Data statis untuk tabel
  const users: User[] = [
    {
      _id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      balance: 3200.5,
      created_at: "2024-12-15T11:37:29.819Z",
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      balance: 1500.75,
      created_at: "2024-12-16T10:20:15.123Z",
    },
    {
      _id: "3",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      balance: 4500.25,
      created_at: "2024-12-14T09:15:10.456Z",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Users</h1>
      <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold tracking-wide">Name</th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wide">Email</th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wide">Balance</th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wide">Created At</th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wide">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">${user.balance.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/users/campaignList/${user._id}`}
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
