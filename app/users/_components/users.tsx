import Link from "next/link";

const User = () => {
  // Simulasi data untuk tabel
  const users = [
    { id: 1, name: "John Doe", status: "pending", date: "14.02.2023", amount: "$3,200" },
    { id: 2, name: "John Doe", status: "done", date: "14.02.2023", amount: "$3,200" },
    { id: 3, name: "John Doe", status: "cancelled", date: "14.02.2023", amount: "$3,200" },
    { id: 4, name: "John Doe", status: "pending", date: "14.02.2023", amount: "$3,200" },
    { id: 5, name: "John Doe", status: "done", date: "14.02.2023", amount: "$3,200" },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Users</h1>
      <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold tracking-wide">Name</th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wide">Status</th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wide">Date</th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wide">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      user.status === "pending"
                        ? "bg-yellow-500 text-black"
                        : user.status === "done"
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">{user.date}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/users/campaignList/${user.id}`}
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
