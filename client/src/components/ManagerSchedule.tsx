// src/pages/ManagerSchedule.tsx
import { useEffect, useState } from 'react';
import { instance } from '../api/axios.api';
import { useAuth } from '../hooks/userAuth';
import { addDays, format } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Application {
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  assignedEmployeeId?: number;
  services: { title: string }[];
  employee?: { id: number; name?: string };
  user: { name?: string; email: string; phone?: string };
}

interface Employee {
  id: number;
  name: string;
}

const HOURS = Array.from({ length: 9 }, (_, i) => 9 + i); // 9:00 to 17:00

const ManagerSchedule = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user: _user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, empsRes] = await Promise.all([
          instance.get('/application'),
          instance.get('/user/employees'),
        ]);

        setApplications(
          appsRes.data.filter((app: Application) => app.status === 'approved')
        );
        setEmployees(empsRes.data);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
      }
    };

    fetchData();
  }, []);

  const getSlotContent = (hour: number, employeeId: number) => {
    const app = applications.find((a) => {
      const start = new Date(a.startDate);
      return (
        a.assignedEmployeeId === employeeId &&
        start.getHours() === hour &&
        start.toDateString() === selectedDate.toDateString()
      );
    });
    if (!app) return null;

    return (
      <div className="bg-blue-600 text-white p-2 rounded text-sm space-y-1">
        <div className="font-semibold">#{app.id} – {app.services?.[0]?.title || 'Услуга'}</div>
        <div>{app.description}</div>
        <div className="text-xs text-gray-200">
          {app.user.name || 'Клиент'} • {app.user.phone || 'нет телефона'}
        </div>
      </div>
    );
  };

  const goToPreviousDay = () => {
    setSelectedDate((prev) => addDays(prev, -1));
  };

  const goToNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cyan-400">График заявок по постам</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousDay}
            className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600"
          >
            <FaChevronLeft />
          </button>
          <span className="text-lg font-medium">
            {format(selectedDate, 'dd.MM.yyyy')}
          </span>
          <button
            onClick={goToNextDay}
            className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-600"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full table-fixed border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 border border-gray-700 w-32 text-left">Время</th>
              {employees.map((emp) => (
                <th
                  key={emp.id}
                  className="p-3 border border-gray-700 text-left"
                >
                  Пост {emp.id}<br />
                  <span className="text-sm text-gray-400">{emp.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour} className="border-t border-gray-800">
                <td className="p-2 border border-gray-800 text-sm text-gray-300">
                  {hour}:00 - {hour + 1}:00
                </td>
                {employees.map((emp) => (
                  <td
                    key={emp.id + '-' + hour}
                    className="p-2 border border-gray-800 align-top"
                  >
                    {getSlotContent(hour, emp.id)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerSchedule;