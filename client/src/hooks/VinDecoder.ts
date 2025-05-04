// hooks/useVinDecoder.ts
import { useState } from 'react';

interface VinResult {
  make: string;
  model: string;
}

export function useVinDecoder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decodeVin = async (vin: string): Promise<VinResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
      const data = await res.json();

      const make = data.Results.find((r: any) => r.Variable === 'Make')?.Value;
      const model = data.Results.find((r: any) => r.Variable === 'Model')?.Value;

      if (make && model && make !== 'Not Applicable') {
        return { make, model };
      } else {
        setError('Не удалось определить авто по VIN');
        return null;
      }
    } catch {
      setError('Ошибка запроса VIN');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { decodeVin, loading, error };
}
