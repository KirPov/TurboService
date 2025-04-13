// src/pages/ServiceEmployeePanel.tsx

import { FaTools, FaCar, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/userAuth';

export default function ServiceEmployeePanel() {
  const { user } = useAuth();

  // Пример данных о текущих задачах
  const tasks = [
    { id: 1, car: 'Toyota Camry', problem: 'Замена масла', status: 'В работе' },
    { id: 2, car: 'Honda Civic', problem: 'Диагностика', status: 'Ожидает' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaTools className="mr-2 text-blue-500" />
            Панель сотрудника сервиса
          </h1>
          <p className="text-gray-600 mt-2">
            Добро пожаловать, <span className="font-semibold text-blue-600">{user?.email}</span>
          </p>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Карточка текущих задач */}
          <div className="bg-white rounded-lg shadow p-6 col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCar className="mr-2 text-green-500" />
              Текущие задания
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Автомобиль</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Проблема</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.car}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.problem}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.status === 'В работе' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Карточка быстрых действий */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-purple-500" />
              Быстрые действия
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center">
                <FaTools className="mr-2" />
                Новая диагностика
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center">
                <FaCar className="mr-2" />
                Завершить работу
              </button>
            </div>

            {/* Статистика */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Ваша статистика</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Выполнено сегодня:</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>В работе:</span>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}