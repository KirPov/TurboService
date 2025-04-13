// src/pages/Application.tsx
import { FC, useState } from 'react';
import { FaCar, FaCalendarAlt, FaClipboardList, FaWrench } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/userAuth';
import { toast } from 'react-toastify';
import axios from 'axios';

const Application: FC = () => {
  const isAuth = useAuth();
  const navigate = useNavigate();

  // State для формы
  const [service, setService] = useState<number | null>(null);
  const [carId, setCarId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!service || !carId || !date || !description) {
      toast.error('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      const response = await axios.post('/api/application', {
        serviceIds: [service],
        carId,
        description,
        date,
      });
      toast.success('Заявка успешно отправлена!');
      navigate('/'); // Переход на главную страницу
    } catch (error) {
      toast.error('Произошла ошибка при отправке заявки.');
    }
  };

  const services = [
    { id: 1, title: 'Диагностика двигателя', description: 'Полная проверка всех систем двигателя' },
    { id: 2, title: 'Замена масла', description: 'С заменой фильтра и диагностикой' },
    { id: 3, title: 'Техническое обслуживание', description: 'Комплексное ТО по регламенту' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
          >
            Запись на ремонт
          </motion.h2>

          {/* Форма */}
          <div className="bg-gray-700 p-8 rounded-xl border border-gray-600 shadow-2xl">
            <div className="mb-6">
              <label htmlFor="service" className="block text-gray-400 font-medium mb-2">Выберите услугу</label>
              <select
                id="service"
                value={service || ''}
                onChange={(e) => setService(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg border border-gray-500"
              >
                <option value="">Выберите услугу</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="car" className="block text-gray-400 font-medium mb-2">Выберите автомобиль</label>
              <input
                id="car"
                type="text"
                value={carId || ''}
                onChange={(e) => setCarId(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg border border-gray-500"
                placeholder="Введите ID автомобиля"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="date" className="block text-gray-400 font-medium mb-2">Выберите дату</label>
              <input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg border border-gray-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-400 font-medium mb-2">Описание</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg border border-gray-500"
                rows={4}
                placeholder="Опишите проблему или запрос"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium w-full"
              onClick={handleSubmit}
            >
              <FaCalendarAlt className="mr-2" />
              Отправить заявку
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Application;
