import { FC } from 'react';
import { FaCar, FaTools, FaHistory, FaUserCog, FaCheckCircle, FaClock, FaSpinner, FaCarSide } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Car {
  id: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface ServiceHistory {
  id: string;
  date: string;
  car: string;
  service: string;
  cost: number;
}

interface RepairStatus {
  id: string;
  car: string;
  status: 'waiting' | 'in_progress' | 'inspection' | 'ready';
  startDate: string;
  estimatedCompletion: string;
}

const ProfilePage: FC = () => {
  // Примерные данные (в реальном приложении будут приходить с API)
  const cars: Car[] = [
    { id: '1', model: 'Toyota Camry', year: 2020, licensePlate: 'А123БВ777' },
    { id: '2', model: 'BMW X5', year: 2019, licensePlate: 'У456КХ777' }
  ];

  const serviceHistory: ServiceHistory[] = [
    { id: '1', date: '15.05.2023', car: 'Toyota Camry', service: 'Замена масла и фильтров', cost: 4500 },
    { id: '2', date: '20.03.2023', car: 'BMW X5', service: 'Диагностика подвески', cost: 3000 }
  ];

  const currentRepairs: RepairStatus[] = [
    { 
      id: '1', 
      car: 'Toyota Camry', 
      status: 'in_progress', 
      startDate: '10.06.2023', 
      estimatedCompletion: '20.06.2023' 
    }
  ];

  const getStatusInfo = (status: RepairStatus['status']) => {
    switch(status) {
      case 'waiting':
        return { text: 'Ожидает ремонта', icon: <FaClock className="text-yellow-500" />, color: 'bg-yellow-500/10 text-yellow-500' };
      case 'in_progress':
        return { text: 'В процессе ремонта', icon: <FaSpinner className="animate-spin text-blue-500" />, color: 'bg-blue-500/10 text-blue-500' };
      case 'inspection':
        return { text: 'Идет проверка', icon: <FaTools className="text-purple-500" />, color: 'bg-purple-500/10 text-purple-500' };
      case 'ready':
        return { text: 'Готово к выдаче', icon: <FaCheckCircle className="text-green-500" />, color: 'bg-green-500/10 text-green-500' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <FaUserCog className="text-3xl text-cyan-400 mr-3" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Личный кабинет
          </h1>
        </motion.div>

        {/* Секция автомобилей */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center mb-6">
            <FaCar className="text-2xl text-cyan-400 mr-3" />
            <h2 className="text-2xl font-bold">Мои автомобили</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {cars.map((car) => (
              <motion.div
                key={car.id}
                whileHover={{ y: -5 }}
                className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-cyan-500 transition-all"
              >
                <h3 className="text-xl font-bold mb-1">{car.model}</h3>
                <div className="flex justify-between text-gray-400">
                  <span>Год: {car.year}</span>
                  <span>{car.licensePlate}</span>
                </div>
                <button className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                  Добавить на ремонт →
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Текущий ремонт */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center mb-6">
            <FaTools className="text-2xl text-amber-400 mr-3" />
            <h2 className="text-2xl font-bold">Текущий ремонт</h2>
          </div>
          
          {currentRepairs.length > 0 ? (
            <div className="space-y-4">
              {currentRepairs.map((repair) => {
                const statusInfo = getStatusInfo(repair.status);
                return (
                  <motion.div
                    key={repair.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{repair.car}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color} flex items-center`}>
                        {statusInfo.icon}
                        <span className="ml-2">{statusInfo.text}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-gray-400 text-sm">
                      <div>
                        <p>Начало работ: {repair.startDate}</p>
                        <p>Завершение: {repair.estimatedCompletion}</p>
                      </div>
                      <div className="bg-gray-600/50 rounded-lg p-2">
                        <p className="font-medium text-white">Прогресс:</p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${
                              repair.status === 'waiting' ? 'bg-yellow-500 w-1/4' :
                              repair.status === 'in_progress' ? 'bg-blue-500 w-2/4' :
                              repair.status === 'inspection' ? 'bg-purple-500 w-3/4' :
                              'bg-green-500 w-full'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FaCarSide className="text-4xl mx-auto mb-4" />
              <p>Сейчас у вас нет автомобилей в ремонте</p>
              <button className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg">
                Записаться на ремонт
              </button>
            </div>
          )}
        </motion.section>

        {/* История обслуживания */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center mb-6">
            <FaHistory className="text-2xl text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold">История обслуживания</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Дата</th>
                  <th className="px-4 py-3 text-left">Автомобиль</th>
                  <th className="px-4 py-3 text-left">Услуга</th>
                  <th className="px-4 py-3 text-left">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {serviceHistory.map((item) => (
                  <motion.tr
                    key={item.id}
                    whileHover={{ backgroundColor: 'rgba(39, 39, 42, 0.5)' }}
                    className="border-b border-gray-700"
                  >
                    <td className="px-4 py-3">{item.date}</td>
                    <td className="px-4 py-3">{item.car}</td>
                    <td className="px-4 py-3">{item.service}</td>
                    <td className="px-4 py-3">{item.cost.toLocaleString()} ₽</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ProfilePage;