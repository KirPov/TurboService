import { useEffect, useState } from "react";
import { FaUserShield, FaSyncAlt, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IUser, UserRole } from "../types/types";

export default function AdminPanel() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Получение пользователей
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4100/api/user");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Изменение роли пользователя
  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      const res = await fetch(`http://localhost:4100/api/user/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error("Ошибка при обновлении роли");
      }

      toast.success("Роль обновлена");
      fetchUsers();
    } catch (error) {
      toast.error("Ошибка при изменении роли");
    }
  };

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toString().includes(searchQuery)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
        Панель администратора <FaUserShield className="inline-block ml-2" />
      </h1>

      <div className="bg-gray-800 text-white rounded-xl shadow-lg p-6">
        <div className="flex mb-4 gap-4">
          <motion.input
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="text"
            className="w-full sm:w-1/3 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Поиск по email или ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchUsers}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 hover:bg-gradient-to-r hover:from-cyan-700 hover:to-blue-600 text-white rounded-lg shadow-lg flex items-center gap-2"
          >
            <FaSyncAlt />
            Обновить список
          </motion.button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Загрузка пользователей...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-xl">
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="text-left bg-gray-700 border-b border-gray-600">
                  <th className="p-3">ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Роль</th>
                  <th className="p-3">Действие</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-600 hover:bg-gray-700 transition-colors duration-300"
                  >
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 text-blue-400 font-semibold">{user.role}</td>
                    <td className="p-3">
                      <select
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      >
                        {["ADMIN", "MANAGER", "CLIENT", "SERVICE_EMPLOYEE"].map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
