import { useEffect, useState } from 'react';
import { instance } from '../api/axios.api';
import { socket } from '../api/socket';
import { FaCheck, FaTimes } from 'react-icons/fa';
import ChatBox from '../components/ChatBox';
import React from 'react';
import { useAuth } from '../hooks/userAuth';

interface Application {
  id: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  workStatus: 'WAITING' | 'IN_PROGRESS' | 'CHECK' | 'READY';
  assignedEmployeeId?: number;
  user: {
    id: number;
    email: string;
    name?: string;
    phone?: string;
  };
}

interface Employee {
  id: number;
  name: string | null;
  email: string;
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { user } = useAuth();
  const [openChats, setOpenChats] = useState<Record<number, boolean>>({});
  const [clientMessageExists, setClientMessageExists] = useState<Record<number, boolean>>({});

  const toggleChat = (id: number) => {
    setOpenChats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appsRes = await instance.get('/application');
        const empsRes = await instance.get('/user/employees');
        const apps = appsRes.data;
        setApplications(apps);
        setEmployees(empsRes.data);

        for (const app of apps) {
          if (app.status === 'approved') {
            const res = await instance.get(`/chat/has-client-message`, {
              params: {
                clientId: app.user.id,
                peerId: user?.id,
                applicationId: app.id
              }
            });
            setClientMessageExists(prev => ({ ...prev, [app.id]: res.data.hasMessage }));
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке заявок, сотрудников или истории чатов:', error);
      }
    };
    if (user?.id) fetchData();
  }, [user?.id]);

  useEffect(() => {
    const handleStatusUpdate = (data: { applicationId: number; status: string }) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === data.applicationId
            ? { ...app, status: data.status as any }
            : app
        )
      );
    };
    socket.on('applicationStatusUpdate', handleStatusUpdate);
    return () => {
      socket.off('applicationStatusUpdate', handleStatusUpdate);
    };
  }, []);

  const handleStatusChange = async (
    id: number,
    status: 'approved' | 'rejected',
    employeeId?: number
  ) => {
    try {
      await instance.patch(`/application/${id}/status`, { status, employeeId });
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения';
      case 'approved': return 'Подтверждена';
      case 'rejected': return 'Отклонена';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Заявки</h1>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Описание</th>
              <th className="px-4 py-2 text-left">Статус</th>
              <th className="px-4 py-2 text-left">Сотрудник</th>
              <th className="px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <React.Fragment key={app.id}>
                <tr className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2">{app.id}</td>
                  <td className="px-4 py-2">{app.description || '—'}</td>
                  <td className="px-4 py-2">{getStatusLabel(app.status)}</td>
                  <td className="px-4 py-2">
                    <select
                      disabled={app.status !== 'pending'}
                      value={app.assignedEmployeeId ?? ''}
                      onChange={(e) =>
                        setApplications((prev) =>
                          prev.map((a) =>
                            a.id === app.id
                              ? { ...a, assignedEmployeeId: +e.target.value }
                              : a
                          )
                        )
                      }
                      className="bg-gray-900 border border-gray-600 text-white rounded px-2 py-1 w-full"
                    >
                      <option value="">Не выбрано</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name || emp.email}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {app.status === 'pending' && (
                      <>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
                          disabled={!app.assignedEmployeeId}
                          onClick={() => handleStatusChange(app.id, 'approved', app.assignedEmployeeId)}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                <tr className="bg-gray-900">
                  <td colSpan={5} className="px-4 py-4">
                    <p className="text-sm text-cyan-400 mb-1">
                      Клиент: {app.user.name || 'Не указано'} ({app.user.email})
                    </p>
                    <p className="text-sm text-gray-400 mb-2">
                      Телефон: {app.user.phone || 'Не указано'}
                    </p>

                    {user?.id && app.status === 'approved' && clientMessageExists[app.id] && app.workStatus !== 'READY' && (
                      <ChatBox peerId={app.user.id} applicationId={app.id} />
                    )}

                    {user?.id && app.status === 'approved' && clientMessageExists[app.id] && app.workStatus === 'READY' && (
                      <div>
                        <button
                          onClick={() => toggleChat(app.id)}
                          className="text-sm text-cyan-400 hover:text-cyan-300"
                        >
                          {openChats[app.id] ? 'Скрыть чат' : 'Показать чат'}
                        </button>

                        {openChats[app.id] && (
                          <div className="mt-3">
                            <ChatBox peerId={app.user.id} applicationId={app.id} />
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
