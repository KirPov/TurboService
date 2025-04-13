import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaCarAlt, FaTools, FaCalendarAlt } from 'react-icons/fa';

const ApplicationCreate: FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [services, setServices] = useState<{ id: number; title: string }[]>([]); // Список услуг
  const [selectedServices, setSelectedServices] = useState<number[]>([]); // Выбранные услуги
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [loading, setLoading] = useState(false);

  // Получаем доступные услуги с сервера
  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:4100/api/service');
      const data = await res.json();
      setServices(data); // тут список услуг
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    }
  };

  useEffect(() => {
    fetchServices(); // Загрузить услуги при монтировании компонента
  }, []);

  // Обработчик отправки формы
  const submitHandler = async () => {
    if (!description || !carBrand || !carModel || selectedServices.length === 0) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:4100/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // здесь предполагается id пользователя, нужно будет передавать в реальном приложении
          carBrand,
          carModel,
          description,
          serviceIds: selectedServices,
        }),
      });

      if (res.ok) {
        toast.success('Заявка успешно отправлена. Ожидайте подтверждения.');
        // Не редиректим на главную, оставляем пользователя на странице
      } else {
        toast.error('Ошибка при отправке заявки');
      }
    } catch (error) {
      toast.error('Ошибка при отправке заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 mb-12 lg:mb-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Создание заявки на ремонт
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Заполните форму, чтобы отправить заявку на ремонт вашего автомобиля.
            </p>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Марка автомобиля"
                  value={carBrand}
                  onChange={(e) => setCarBrand(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Модель автомобиля"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="Описание проблемы"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-center text-cyan-400 mb-4">
                  Выберите услуги
                </h3>
                <div className="space-y-2">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-4"
                    >
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        value={service.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, service.id]);
                          } else {
                            setSelectedServices(
                              selectedServices.filter((id) => id !== service.id),
                            );
                          }
                        }}
                        className="text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                      />
                      <label
                        htmlFor={`service-${service.id}`}
                        className="text-lg text-gray-300"
                      >
                        {service.title}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={submitHandler}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium text-white flex items-center justify-center"
              >
                {loading ? 'Отправка...' : 'Отправить заявку'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationCreate;
