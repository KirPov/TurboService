import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 text-center">
      {/* Анимированная иконка ошибки */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
          <FaExclamationTriangle className="text-5xl text-white" />
        </div>
        <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-red-500 to-rose-600 opacity-0 hover:opacity-30 blur-md transition-opacity duration-300"></div>
      </motion.div>

      {/* Текст ошибки */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent mb-4">
          404 ERROR
        </h1>
        <h2 className="text-2xl font-medium text-gray-300 mb-6">
          Страница не найдена
        </h2>
        <p className="text-gray-400 max-w-md mb-8">
          Запрашиваемая страница не существует или была перемещена.
          Пожалуйста, проверьте URL или воспользуйтесь кнопками ниже.
        </p>
      </motion.div>

      {/* Кнопки действий */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/40"
        >
          <FaHome className="mr-2" />
          На главную
        </button>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium border border-gray-700 transition-all"
        >
          <FaRedo className="mr-2" />
          Обновить
        </button>
      </motion.div>

      {/* Дополнительный декор */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-9xl font-black text-gray-800 select-none pointer-events-none"
      >
        404
      </motion.div>
    </div>
  );
};

export default ErrorPage;