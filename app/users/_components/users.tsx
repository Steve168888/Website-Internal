import Link from "next/link";
import { fetchAPI } from "@/services/api"; // Import fungsi fetchAPI

// Tipe Data User
interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  created_at: string;
}

// Props untuk Komponen
interface UserPageProps {
  users: User[];
}

// Fetch data dari server menggunakan Server-Side Rendering
export const getServerSideProps = async () => {
  try {
    // Fetch data dari API endpoint /account/get
    const response = await fetchAPI<{ data: User[] }>("account/get");
    console.log("Fetched Data:", response.data); // Debugging untuk memastikan data berhasil

    return {
      props: {
        users: response.data || [], // Kirim data atau default ke array kosong jika undefined
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      props: {
        users: [], // Default ke array kosong jika terjadi error
      },
    };
  }
};

// Komponen Utama
const User = ({ users }: UserPageProps) => {
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
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
