// src/components/Footer.tsx
import { FaCar, FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
                <span className="text-gray-400">+7 (123) 456-78-90</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="text-cyan-400 mt-1 mr-3" />
                <span className="text-gray-400">info@turboservice.ru</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-cyan-400 mt-1 mr-3" />
                <span className="text-gray-400">г. Москва, ул. Автозаводская, 12</span>
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
                <a href="/" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Главная
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Услуги
                </a>
              </li>
              <li>
                <a href="/application" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Запись
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Профиль
                </a>
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
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-colors">
                <span className="sr-only">VK</span>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.7 15.3h-1.4v-5.1h-1.1v-1.5h2.5v6.6zm3.3-6.6h-1.5v1.5h1.5v1.5h-1.5v1.5h1.5v1.5h-2.5v-6.6h2.5v1.5z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-colors">
                <span className="sr-only">Telegram</span>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.33 1.48-1.73 5.08-2.45 6.72-.31.69-.92 1.15-1.65 1.15-.54 0-1.07-.22-1.45-.6l-1.04-1.01-1.07 1.05-.31.3c-.2.2-.52.31-.82.31-.25 0-.49-.09-.68-.25-.47-.4-.5-1.07-.08-1.52l2.15-2.17 1.33-1.34-1.5-1.45c-.38-.37-.59-.87-.59-1.39 0-.53.21-1.04.59-1.42.37-.37.88-.58 1.41-.58.18 0 .36.03.53.1.45.18.78.58.89 1.06l.93 3.67.72-3.83c.11-.58.51-1.06 1.05-1.24.54-.18 1.13-.04 1.53.36.37.37.55.87.52 1.38z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-colors">
                <span className="sr-only">WhatsApp</span>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
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