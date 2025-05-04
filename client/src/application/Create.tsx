import { FC, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaTools, FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DateTimePicker, { DateTimePickerRef } from './DateTimePicker';
import CarAutoSelect from '../components/CarSelector';
import { socket } from '../api/socket';
import { useAuth } from '../hooks/userAuth';
import ChatBox from '../components/ChatBox';

interface Service {
  id: number;
  title: string;
  duration: number;
}

const ApplicationCreate: FC = () => {
  const navigate = useNavigate();
  const dateTimePickerRef = useRef<DateTimePickerRef>(null);

  const [description, setDescription] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState<number | null>(null);
  const [rememberCar, setRememberCar] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<{ start: string; end: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const [useSavedCar, setUseSavedCar] = useState(false);
  const [savedCars, setSavedCars] = useState<any[]>([]);
  const [selectedSavedCarId, setSelectedSavedCarId] = useState<number | null>(null);

  const { user } = useAuth();

  const totalDuration = services
    .filter((s) => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:4100/api/service');
      const data = await res.json();
      setServices(data);
    } catch {
      toast.error('Ошибка загрузки услуг');
    }
  };

  const fetchSavedCars = async () => {
    try {
      const res = await fetch(`http://localhost:4100/api/cars/me?userId=${user?.id}`);
      const data = await res.json();
      setSavedCars(data);
    } catch {
      toast.error('Ошибка загрузки автомобилей');
    }
  };

  const fetchApplicationStatus = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:4100/api/application/${id}`);
      const data = await res.json();
      setIsApproved(data.status === 'approved');
    } catch (err) {
      console.error('Ошибка при получении статуса заявки:', err);
    }
  };

  const submitHandler = async () => {
    if (!description || (!carBrand || !carModel || !carYear) || selectedServices.length === 0 || !selectedDateTime) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:4100/api/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          carId: useSavedCar ? selectedSavedCarId : null,
          carBrand,
          carModel,
          year: carYear,
          description,
          serviceIds: selectedServices,
          date: selectedDateTime.start,
          rememberCar,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Заявка успешно отправлена');
        setApplicationId(result.id);
        localStorage.setItem('lastApplicationId', result.id.toString());
        await fetchApplicationStatus(result.id);

        setDescription('');
        setCarBrand('');
        setCarModel('');
        setCarYear(null);
        setSelectedServices([]);
        setSelectedDateTime(null);
        setRememberCar(false);
        dateTimePickerRef.current?.refetchSlots();
      } else {
        toast.error(result.message || 'Ошибка при отправке заявки');
      }
    } catch {
      toast.error('Ошибка при отправке');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    if (user?.id) fetchSavedCars();

    const lastId = localStorage.getItem('lastApplicationId');
    if (lastId) {
      const id = parseInt(lastId);
      setApplicationId(id);
      fetchApplicationStatus(id);
    }
  }, [user]);

  useEffect(() => {
    const selected = savedCars.find((c) => c.id === selectedSavedCarId);
    if (selected) {
      setCarBrand(selected.brand);
      setCarModel(selected.model);
      setCarYear(selected.year);
    }
  }, [selectedSavedCarId]);

  useEffect(() => {
    const handleStatusUpdate = (data: { applicationId: number; status: string }) => {
      if (data.applicationId === applicationId && data.status === 'approved') {
        toast.info('Заявка подтверждена!');
        setIsApproved(true);
      }
    };

    socket.on('applicationStatusUpdate', handleStatusUpdate);
    return () => {
      socket.off('applicationStatusUpdate', handleStatusUpdate);
    };
  }, [applicationId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8 space-y-8 border border-gray-700">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
        >
          Создание заявки на ремонт
        </motion.h1>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useSavedCar}
            onChange={() => {
              setUseSavedCar(!useSavedCar);
              setSelectedSavedCarId(null);
              setCarBrand('');
              setCarModel('');
              setCarYear(null);
            }}
            className="accent-cyan-500"
          />
          <span className="text-sm">Выбрать из сохранённых авто</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {useSavedCar ? (
              <div>
                <label className="block text-sm mb-1 text-gray-300">Выберите автомобиль</label>
                <select
                  value={selectedSavedCarId ?? ''}
                  onChange={(e) => setSelectedSavedCarId(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="">— Не выбрано —</option>
                  {savedCars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model} ({car.year})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <CarAutoSelect
                onCarSelected={(brand, model) => {
                  setCarBrand(brand);
                  setCarModel(model);
                }}
                initialBrand={carBrand}
                initialModel={carModel}
              />
            )}

            <div>
              <label className="block text-sm mb-1 text-gray-300">Год выпуска</label>
              <input
                type="number"
                value={carYear ?? ''}
                onChange={(e) => {
                  const year = parseInt(e.target.value, 10);
                  setCarYear(!isNaN(year) ? year : null);
                }}
                placeholder="Например: 2015"
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded"
                min={1950}
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Описание проблемы</label>
              <textarea
                placeholder="Например: стук в подвеске..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg resize-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                id="rememberCar"
                type="checkbox"
                checked={rememberCar}
                onChange={(e) => setRememberCar(e.target.checked)}
                className="accent-cyan-500"
              />
              <label htmlFor="rememberCar" className="text-sm text-gray-300">
                Запомнить автомобиль
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div
                className="flex justify-between items-center cursor-pointer text-cyan-400 hover:text-cyan-300 transition-colors mb-2"
                onClick={() => setShowServices(!showServices)}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaTools /> Выберите услуги
                </h3>
                {showServices ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              <motion.div
                initial={false}
                animate={{ height: showServices ? 'auto' : 0, opacity: showServices ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        value={service.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, service.id]);
                          } else {
                            setSelectedServices(selectedServices.filter((id) => id !== service.id));
                          }
                        }}
                        checked={selectedServices.includes(service.id)}
                        className="text-cyan-500"
                      />
                      <label htmlFor={`service-${service.id}`} className="text-gray-300">
                        {service.title}
                        <span className="ml-2 text-sm text-gray-400">({service.duration} мин)</span>
                      </label>
                    </motion.div>
                  ))}
                </div>

                {totalDuration > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="text-sm text-gray-400">
                      Итого: <span className="text-white font-semibold">{totalDuration} мин</span>
                    </div>
                    <div className="w-full h-3 bg-gray-600 rounded">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(totalDuration, 180) / 180 * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded ${
                          totalDuration <= 60
                            ? 'bg-green-500'
                            : totalDuration <= 120
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2 mb-2">
                <FaCalendarAlt /> Дата и время
              </h3>
              <DateTimePicker
                ref={dateTimePickerRef}
                services={services.filter((s) => selectedServices.includes(s.id))}
                onDateTimeSelected={(start, end) => setSelectedDateTime({ start, end })}
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={submitHandler}
          disabled={loading}
          className="w-full md:w-1/2 mx-auto block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium text-white text-center mt-8"
        >
          {loading ? 'Отправка...' : 'Отправить заявку'}
        </motion.button>
      </div>
    </div>
  );
};

export default ApplicationCreate;