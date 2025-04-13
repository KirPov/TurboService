import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Типизация заявки
interface Application {
  id: number;
  description: string;
  status: string;
}

const AdminApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const socket = io("http://localhost:4100"); // Подключаемся к WebSocket серверу

  useEffect(() => {
    socket.on(
      "applicationStatusUpdate",
      (data: { applicationId: number; status: string }) => {
        // Когда приходит событие о статусе заявки, сразу обновляем её статус в UI
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app.id === data.applicationId
              ? { ...app, status: data.status }
              : app
          )
        );
      }
    );

    return () => {
      socket.off("applicationStatusUpdate");
    };
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:4100/api/application");
      if (!res.ok) {
        throw new Error("Ошибка при загрузке заявок");
      }
      const data: Application[] = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Ошибка при загрузке заявок: ", error);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(
        `http://localhost:4100/api/application/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        console.log(
          `Статус для заявки ID: ${id} успешно изменен на: ${status}`
        );
      } else {
        throw new Error("Ошибка при изменении статуса заявки");
      }
    } catch (error) {
      console.error("Ошибка при изменении статуса заявки: ", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <div className="text-center p-4">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Заявки</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Описание</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{app.id}</td>
                <td className="px-4 py-2">{app.description}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      app.status === "pending"
                        ? "bg-yellow-400 text-black"
                        : app.status === "approved"
                        ? "bg-green-400 text-white"
                        : "bg-red-400 text-white"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  {app.status === "pending" && (
                    <>
                      <button
                        onClick={() => changeStatus(app.id, "approved")}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Подтвердить
                      </button>
                      <button
                        onClick={() => changeStatus(app.id, "rejected")}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplications;
