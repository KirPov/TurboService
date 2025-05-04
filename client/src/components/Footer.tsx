// src/components/Footer.tsx
import { FaCar, FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Лого и описание */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <FaCar className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                TURBO<span className="font-extrabold">SERVICE</span>
              </span>
            </div>
            <p className="text-gray-400">
              Профессиональный сервис по ремонту и обслуживанию автомобилей
            </p>
          </motion.div>

          {/* Контакты */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaPhone className="text-cyan-400 mt-1 mr-3" />
                <span className="text-gray-400">+7 (908) 183-78-44</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="text-cyan-400 mt-1 mr-3" />
                <span className="text-gray-400">info@turboservice.ru</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-cyan-400 mt-1 mr-3" />
                <span className="text-gray-400">г. Новочеркасск, ул. Харьковское, 9а</span>
              </li>
              <li className="flex items-start">
                <FaClock className="text-cyan-400 mt-1 mr-3" />
                <span className="text-gray-400">Пн-Пт: 9:00 - 20:00</span>
              </li>
            </ul>
          </motion.div>

          {/* Навигация */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Навигация</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link to="/application" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Запись
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Профиль
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Соцсети */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Мы в соцсетях</h3>
            <div className="flex space-x-4">
              {/* Здесь можно подключить реальные ссылки на соцсети */}
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-colors">
                <span className="sr-only">VK</span>
                {/* SVG иконка VK */}
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-colors">
                <span className="sr-only">Telegram</span>
                {/* SVG иконка Telegram */}
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-colors">
                <span className="sr-only">WhatsApp</span>
                {/* SVG иконка WhatsApp */}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Копирайт */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} TURBOSERVICE. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
