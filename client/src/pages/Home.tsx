// src/pages/Home.tsx
import { motion } from "framer-motion";
import { FC } from "react";
import {
  FaCalendarAlt,
  FaCar,
  FaCarCrash,
  FaOilCan,
  FaTools,
  FaUserCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/userAuth";

const Home: FC = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const handleApplicationClick = () => {
    if (!isAuth) {
      toast.info("Для записи на ремонт необходимо авторизоваться", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
        style: { background: "#1e293b", color: "#e2e8f0" },
      });
      navigate("/auth");
    } else {
      navigate("/application");
    }
  };

  const handleProfileClick = () => {
    if (!isAuth) {
      toast.info("Для доступа к личному кабинету необходимо авторизоваться", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
        style: { background: "#1e293b", color: "#e2e8f0" },
      });
      navigate("/auth");
    } else {
      navigate("/profile");
    }
  };

  const features = [
    {
      icon: (
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaTools className="text-2xl text-cyan-400" />
        </motion.div>
      ),
      title: "Профессиональный ремонт",
      description: "Сертифицированные мастера с опытом работы",
    },
    {
      icon: (
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCarCrash className="text-2xl text-cyan-400" />
        </motion.div>
      ),
      title: "Диагностика",
      description: "Компьютерная диагностика всех систем",
    },
    {
      icon: (
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <FaCalendarAlt className="text-2xl text-cyan-400" />
        </motion.div>
      ),
      title: "Онлайн-запись",
      description: "Удобное бронирование времени",
    },
  ];

  const services = [
    {
      id: 1,
      title: "Диагностика двигателя",
      description: "Полная проверка всех систем двигателя",
      icon: <FaCar className="text-3xl text-amber-500" />,
    },
    {
      id: 2,
      title: "Замена масла",
      description: "С заменой фильтра и диагностикой",
      icon: <FaOilCan className="text-3xl text-amber-500" />,
    },
    {
      id: 3,
      title: "Техническое обслуживание",
      description: "Комплексное ТО по регламенту",
      icon: <FaTools className="text-3xl text-amber-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 mb-12 lg:mb-0"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Профессиональный сервис для вашего автомобиля
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Полный спектр услуг по ремонту и обслуживанию автомобилей с
                гарантией качества.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium flex items-center"
                  onClick={handleApplicationClick}
                >
                  <FaCalendarAlt className="mr-2" />
                  Запись на ремонт
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-800 border border-cyan-500 rounded-lg font-medium flex items-center"
                  onClick={handleProfileClick}
                >
                  <FaUserCog className="mr-2" />
                  Личный кабинет
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
                <FaCar className="text-6xl text-cyan-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Наши преимущества
                </h3>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className="bg-cyan-500/20 p-2 rounded-full mr-4">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-gray-400">{feature.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
          >
            Популярные услуги
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-amber-500 transition-all cursor-pointer"
                onClick={handleApplicationClick}
              >
                <div className="text-center mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4 text-center">
                  {service.description}
                </p>
                <div className="text-amber-400 hover:text-amber-300 font-medium flex items-center justify-center">
                  Записаться →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
