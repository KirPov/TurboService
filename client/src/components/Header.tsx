import { FC } from 'react';
import { FaCarAlt, FaCalendarAlt, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/userAuth';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/user/userSlice';
import { removeTokenFromLocalStorage, removeUserFromLocalStorage } from '../helpers/localstorage.helper';
import { toast } from 'react-toastify';

const Header: FC = () => {
  const { isAuth, user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    removeTokenFromLocalStorage('token');
    removeUserFromLocalStorage();
    toast.success('Вы успешно вышли');
    setTimeout(() => navigate('/', { replace: true }), 50);
  };

  return (
    <header className="bg-gray-950 text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center cursor-pointer group"
            onClick={() => {
              navigate('/');
              window.scrollTo(0, 0);
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <FaCarAlt className="text-white text-xl" />
              </div>
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-40 blur-sm transition-all duration-300"></div>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-tight">
              TURBO<span className="font-extrabold">SERVICE</span>
            </span>
          </motion.div>

          <div className="flex items-center gap-4">
            {isAuth ? (
              <>
                {role === 'ADMIN' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg font-medium"
                    onClick={() => navigate('/admin')}
                  >
                    Панель администратора
                  </motion.button>
                )}

                {role === 'MANAGER' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 rounded-lg font-medium"
                      onClick={() => navigate('/manager')}
                    >
                      Панель менеджера
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium"
                      onClick={() => navigate('/manager/schedule')}
                    >
                      Календарь
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium"
                      onClick={() => navigate('/application')}
                    >
                      <FaCalendarAlt className="mr-2" />
                      Запись на ремонт
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-gray-800 border border-cyan-500 rounded-lg font-medium"
                      onClick={() => navigate('/profile')}
                    >
                      <FaUser className="mr-2" />
                      Профиль
                    </motion.button>
                  </>
                )}

                {role === 'SERVICE_EMPLOYEE' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg font-medium"
                    onClick={() => navigate('/service')}
                  >
                    Панель сотрудника
                  </motion.button>
                )}

                {role === 'CLIENT' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-medium"
                      onClick={() => navigate('/application')}
                    >
                      <FaCalendarAlt className="mr-2" />
                      Запись на ремонт
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-gray-800 border border-cyan-500 rounded-lg font-medium"
                      onClick={() => navigate('/profile')}
                    >
                      <FaUser className="mr-2" />
                      Профиль
                    </motion.button>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#dc2626' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-red-900/50 text-red-400 transition-all"
                  onClick={logoutHandler}
                >
                  <FaSignOutAlt />
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium"
                onClick={() => navigate('/auth')}
              >
                <FaSignInAlt className="mr-2" />
                Войти
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
