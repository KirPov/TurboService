import { FC, useEffect, useState } from 'react';
import { FaCar, FaUserCog, FaTrash, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/userAuth';
import ProgressRoad from '../components/ProgressRoad';
import ChatBox from '../components/ChatBox';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  remembered: boolean;
  createdAt: string;
}

interface Application {
  id: number;
  description: string;
  status: string;
  workStatus: string | null;
  createdAt: string;
  startDate: string;
  endDate: string;
  car: {
    brand: string;
    model: string;
  };
  user: {
    id: number;
  };
}

const ProfilePage: FC = () => {
  const { user, isAuth } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [openChats, setOpenChats] = useState<Record<number, boolean>>({});

  const fetchCars = async () => {
    try {
      const res = await fetch(`http://localhost:4100/api/cars/me?userId=${user?.id}`);
      const data = await res.json();
      setCars(data);
    } catch {
      toast.error('Ошибка загрузки автомобилей');
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch(`http://localhost:4100/api/user/${user?.id}`);
      const data = await res.json();
      setName(data.name || '');
      setPhone(data.phone || '');
    } catch {
      toast.error('Ошибка загрузки данных профиля');
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`http://localhost:4100/api/application`);
      const data = await res.json();
      const myApps = data.filter((a: Application) => a.user?.id === user?.id);
      setApplications(myApps);
    } catch {
      toast.error('Ошибка загрузки заявок');
    }
  };

  const deleteCar = async (id: number) => {
    if (!confirm('Удалить автомобиль?')) return;
    try {
      const res = await fetch(`http://localhost:4100/api/cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Автомобиль удалён');
        setCars((prev) => prev.filter((c) => c.id !== id));
      } else toast.error('Ошибка удаления автомобиля');
    } catch {
      toast.error('Ошибка удаления автомобиля');
    }
  };

  const updateProfile = async () => {
    try {
      const res = await fetch(`http://localhost:4100/api/user/${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) {
        toast.success('Профиль обновлён');
        setIsEditing(false);
      } else toast.error('Ошибка обновления профиля');
    } catch {
      toast.error('Ошибка при обновлении');
    }
  };

  useEffect(() => {
    if (isAuth && user?.id) {
      fetchCars();
      fetchUserData();
      fetchApplications();
    }
  }, [user]);

  const currentApps = applications.filter(
    (a) => a.status === 'approved' && a.workStatus !== 'READY'
  );
  const finishedApps = applications.filter(
    (a) => a.status === 'approved' && a.workStatus === 'READY'
  );

  const toggleChat = (id: number) => {
    setOpenChats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Блок профиля */}
        <motion.section className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-10">
          <h2 className="text-xl font-semibold mb-4">Данные профиля</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="p-2 bg-gray-700 border border-gray-600 rounded disabled:opacity-60"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
            <input
              className="p-2 bg-gray-700 border border-gray-600 rounded disabled:opacity-60"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="mt-4">
            {isEditing ? (
              <button onClick={updateProfile} className="px-5 py-2 bg-cyan-600 rounded hover:bg-cyan-700">
                Сохранить изменения
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-gray-600 rounded hover:bg-gray-700">
                Редактировать
              </button>
            )}
          </div>
        </motion.section>

        {/* Заявки и автомобили (без изменений) */}
        <motion.section className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-10 shadow-lg">
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-2xl text-cyan-400 mr-3" />
            <h2 className="text-2xl font-bold">Текущие заявки</h2>
          </div>
          {currentApps.length === 0 ? (
            <p className="text-gray-400">Нет активных заявок</p>
          ) : (
            <div className="space-y-4">
              {currentApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-700 rounded-lg border border-gray-600 shadow-md hover:shadow-cyan-500/30 transition-all"
                >
                  <h3 className="text-lg font-bold">{app.car.brand} {app.car.model}</h3>
                  <p className="text-sm text-gray-300">{app.description}</p>
                  <ProgressRoad status={app.workStatus as any} />
                  <p className="text-sm text-gray-400 mt-1">Начало: {new Date(app.startDate).toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Окончание: {new Date(app.endDate).toLocaleString()}</p>

                  {/* Чат */}
                  <div className="mt-4">
                    <h4 className="text-sm text-cyan-400 mb-2">Чат с менеджером</h4>
                    <ChatBox peerId={12} applicationId={app.id} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* История заявок */}
        <motion.section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">История заявок</h2>
          {finishedApps.length === 0 ? (
            <p className="text-gray-400">История пуста</p>
          ) : (
            finishedApps.map((app) => (
              <div key={app.id} className="mb-4 p-4 bg-gray-700 rounded border border-gray-600">
                <div className="text-lg font-semibold">{app.car.brand} {app.car.model}</div>
                <p className="text-sm text-gray-300">{app.description}</p>
                <p className="text-sm text-gray-400">Статус: Готово к выдаче</p>
                <p className="text-sm text-gray-400">Дата завершения: {new Date(app.endDate).toLocaleString()}</p>
                <div className="mt-3">
                  <button
                    onClick={() => toggleChat(app.id)}
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    {openChats[app.id] ? 'Скрыть чат' : 'Показать историю чата'}
                  </button>

                  {openChats[app.id] && (
                    <div className="mt-3">
                      <ChatBox peerId={12} applicationId={app.id} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default ProfilePage;
