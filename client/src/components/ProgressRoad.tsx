// components/ProgressRoad.tsx
import { FC } from 'react';
import { FaCarSide } from 'react-icons/fa';

interface Props {
  status: 'WAITING' | 'IN_PROGRESS' | 'CHECK' | 'READY';
}

const stages = ['WAITING', 'IN_PROGRESS', 'CHECK', 'READY'];
const stageLabels: Record<string, string> = {
  WAITING: 'Ожидает',
  IN_PROGRESS: 'В работе',
  CHECK: 'Проверка',
  READY: 'Готово',
};

const ProgressRoad: FC<Props> = ({ status }) => {
  const currentIndex = stages.indexOf(status);

  return (
    <div className="relative w-full h-20 mt-4 mb-2">
      {/* Линия */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-600 transform -translate-y-1/2 rounded" />

      {/* Этапы */}
      <div className="flex justify-between items-center relative z-10">
        {stages.map((stage, index) => {
          const isActive = index <= currentIndex;
          return (
            <div key={stage} className="relative w-1/4 flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300
                  ${isActive ? 'bg-cyan-400 text-white' : 'bg-gray-600 text-gray-300'}
                `}
              >
                {index + 1}
              </div>
              <span className="text-sm mt-1">{stageLabels[stage]}</span>
            </div>
          );
        })}
      </div>

      {/* Машинка */}
      <div
        className="absolute -top-6 transition-all duration-500 ease-in-out"
        style={{
          left: `${(currentIndex / (stages.length - 1)) * 100}%`,
          transform: 'translateX(-50%)',
        }}
      >
        <FaCarSide className="text-cyan-400 text-2xl animate-bounce" />
      </div>
    </div>
  );
};

export default ProgressRoad;
