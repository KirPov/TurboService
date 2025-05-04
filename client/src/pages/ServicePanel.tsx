import { useEffect, useState } from 'react';
import { FaTools, FaCar, FaCheckCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../hooks/userAuth';
import { instance } from '../api/axios.api';
import { toast } from 'react-toastify';

interface Application {
  id: number;
  description: string;
  workStatus: 'WAITING' | 'IN_PROGRESS' | 'CHECK' | 'READY';
  startDate: string;
  car: {
    brand: string;
    model: string;
    year?: number;
  };
  createdAt: string;
  services: {
    title: string;
  }[];
}

const statusOptions = ['WAITING', 'IN_PROGRESS', 'CHECK', 'READY'];

const statusLabels: Record<string, string> = {
  WAITING: 'Ожидает выполнения',
  IN_PROGRESS: 'Выполняются работы',
  CHECK: 'Проверка',
  READY: 'Готово к выдаче',
};

const statusColors: Record<string, string> = {
  WAITING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  CHECK: 'bg-purple-100 text-purple-800',
  READY: 'bg-green-100 text-green-800',
};

export default function ServiceEmployeePanel() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get(`/application/employee/${user?.id}`);
        const sorted = res.data.sort(
          (a: Application, b: Application) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        setApplications(sorted);
      } catch (err) {
        toast.error('Ошибка загрузки заявок');
      }
    };
    if (user?.id) fetchData();
  }, [user?.id]);

  const handleStatusChange = async (id: number, newStatus: Application['workStatus']) => {
    const currentApp = applications.find((a) => a.id === id);
    if (!currentApp) return;

    const currentIndex = statusOptions.indexOf(currentApp.workStatus);
    const nextIndex = statusOptions.indexOf(newStatus);

    if (nextIndex <= currentIndex) {
      toast.warning('Нельзя откатиться на предыдущий статус');
      return;
    }

    const confirmChange = confirm(`Подтвердить переход на статус "${statusLabels[newStatus]}"?`);
    if (!confirmChange) return;

    try {
      await instance.patch(`/application/${id}/work-status`, { workStatus: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, workStatus: newStatus } : app))
      );
      toast.success('Статус обновлён');
    } catch (err) {
      toast.error('Ошибка обновления статуса');
    }
  };

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const activeApps = applications.filter((app) => {
    const appDate = new Date(app.startDate);
    return app.workStatus !== 'READY' && isSameDay(appDate, currentDate);
  });

  const historyApps = applications.filter(
    (app) =>
      app.workStatus === 'READY' &&
      new Date(app.startDate).getTime() >= oneMonthAgo.getTime()
  );

  const goToPrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
            <FaTools className="mr-2 text-blue-500" /> Панель сотрудника сервиса
          </h1>
          <p className="text-gray-600">
            Добро пожаловать, <span className="text-blue-600 font-semibold">{user?.email}</span>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Заявки на {currentDate.toLocaleDateString()}</h2>
          <div className="flex justify-between mb-4">
            <button onClick={goToPrevDay} className="text-sm text-blue-600 flex items-center">
              <FaArrowLeft className="mr-1" /> Предыдущий день
            </button>
            <button onClick={goToNextDay} className="text-sm text-blue-600 flex items-center">
              Следующий день <FaArrowRight className="ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {activeApps.length === 0 ? (
              <p className="text-gray-500">Нет активных заявок на выбранный день</p>
            ) : (
              activeApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:border-blue-400 transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                      <FaCar className="mr-2 text-green-600" />
                      {app.car.brand} {app.car.model}
                      {app.car.year && (
                        <span className="ml-2 text-sm text-gray-500 font-normal">
                          ({app.car.year})
                        </span>
                      )}
                    </h2>
                    <span className="text-sm text-gray-400">#{app.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{app.description}</p>
                  <div className="text-sm text-gray-500 mb-1">
                    Услуги:{' '}
                    <span className="text-gray-700 font-medium">
                      {app.services.map((s) => s.title).join(', ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Время начала: {new Date(app.startDate).toLocaleString()}
                  </div>
                  <div className="text-sm font-medium mb-2">
                    <span className="text-gray-600 mr-1">Статус:</span>
                    <span className={`px-2 py-1 rounded ${statusColors[app.workStatus]}`}>
                      {statusLabels[app.workStatus]}
                    </span>
                  </div>
                  <select
                    value=""
                    className="w-full mt-2 border px-3 py-2 rounded bg-white text-gray-800"
                    onChange={(e) =>
                      handleStatusChange(app.id, e.target.value as Application['workStatus'])
                    }
                  >
                    <option value="" disabled>
                      Изменить статус
                    </option>
                    {statusOptions.map(
                      (option) =>
                        statusOptions.indexOf(option) >
                          statusOptions.indexOf(app.workStatus) && (
                          <option key={option} value={option}>
                            {statusLabels[option]}
                          </option>
                        )
                    )}
                  </select>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center text-green-700">
            <FaCheckCircle className="mr-2" /> История заявок за месяц
          </h2>
          {historyApps.length === 0 ? (
            <p className="text-gray-500">Нет завершённых заявок за последний месяц</p>
          ) : (
            <div className="space-y-4">
              {historyApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-gray-800">
                      {app.car.brand} {app.car.model}
                      {app.car.year && (
                        <span className="ml-2 text-sm text-gray-500 font-normal">
                          ({app.car.year})
                        </span>
                      )}
                    </h2>
                    <span className="text-sm text-gray-400">#{app.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{app.description}</p>
                  <div className="text-sm mb-1 text-gray-500">
                    Услуги:{' '}
                    <span className="text-gray-700 font-medium">
                      {app.services.map((s) => s.title).join(', ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">Завершено: {new Date(app.startDate).toLocaleString()}</div>
                  <div
                    className={`text-sm font-medium ${statusColors[app.workStatus]} px-2 py-1 rounded mt-2 inline-block`}
                  >
                    {statusLabels[app.workStatus]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}