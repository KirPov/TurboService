import React, { useEffect, useState } from 'react';
import carData from '../assets/car-data.json';

interface CarEntry {
  brand: string;
  models: string[];
}

interface CarAutoSelectProps {
  onCarSelected: (brand: string, model: string) => void;
  disabled?: boolean;
  initialBrand?: string;
  initialModel?: string;
}

const CarAutoSelect: React.FC<CarAutoSelectProps> = ({
  onCarSelected,
  disabled = false,
  initialBrand = '',
  initialModel = '',
}) => {
  const [brand, setBrand] = useState(initialBrand);
  const [model, setModel] = useState(initialModel);
  const [models, setModels] = useState<string[]>([]);

  const brands = carData.map((entry: CarEntry) => entry.brand);

  useEffect(() => {
    const selected = carData.find((entry: CarEntry) => entry.brand === brand);
    if (selected) {
      setModels(selected.models);
      if (!selected.models.includes(model)) {
        setModel('');
      }
    } else {
      setModels([]);
      setModel('');
    }
  }, [brand]);

  useEffect(() => {
    onCarSelected(brand, model);
  }, [brand, model]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1 text-gray-300">Марка автомобиля</label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg disabled:opacity-60"
        >
          <option value="">Выберите марку</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {models.length > 0 && (
        <div>
          <label className="block text-sm mb-1 text-gray-300">Модель автомобиля</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg disabled:opacity-60"
          >
            <option value="">Выберите модель</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CarAutoSelect;
