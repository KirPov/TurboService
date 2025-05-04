import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isSunday } from 'date-fns';
import axios from 'axios';

export interface DateTimePickerRef {
  refetchSlots: () => void;
}

interface Service {
  id: number;
  duration: number;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface DateTimePickerProps {
  services: Service[];
  onDateTimeSelected: (startDate: string, endDate: string) => void;
}

const DateTimePicker = forwardRef<DateTimePickerRef, DateTimePickerProps>(
  ({ services, onDateTimeSelected }, ref) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const totalDuration = services.reduce((acc, s) => acc + s.duration, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fetchAvailableSlots = async (date: string) => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:4100/api/available-slots', {
          params: {
            date,
            duration: totalDuration,
          },
        });
        setAvailableSlots(res.data.filter((slot: TimeSlot) => slot.isAvailable));
      } catch (error) {
        console.error('Ошибка при получении слотов:', error);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    const handleSelectSlot = (slot: TimeSlot, index: number) => {
      setSelectedSlotIndex(index);
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);
      onDateTimeSelected(
        format(start, 'yyyy-MM-dd HH:mm:ss'),
        format(end, 'yyyy-MM-dd HH:mm:ss')
      );
    };

    const handleDateChange = (date: Date | null) => {
      setSelectedDate(date);
      if (date && totalDuration > 0) {
        const formatted = format(date, 'yyyy-MM-dd');
        fetchAvailableSlots(formatted);
      }
    };

    useImperativeHandle(ref, () => ({
      refetchSlots: () => {
        if (selectedDate && totalDuration > 0) {
          fetchAvailableSlots(format(selectedDate, 'yyyy-MM-dd'));
        }
      },
    }));

    return (
      <div className="p-2">
        {totalDuration === 0 ? (
          <p className="text-red-400">Сначала выберите хотя бы одну услугу</p>
        ) : (
          <>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 w-full max-w-sm mx-auto">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd.MM.yyyy"
                minDate={today}
                filterDate={(d) => !isSunday(d) && d >= today}
                inline
                calendarClassName="!bg-gray-900 !text-white text-sm"
              />
            </div>

            <div className="mt-4">
              <h4 className="text-center text-white font-semibold mb-2">
                Доступные слоты:
              </h4>
              {loading ? (
                <p className="text-center text-gray-400">Загрузка...</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-center text-gray-400">
                  Нет доступных слотов на выбранную дату
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSlot(slot, idx)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                        selectedSlotIndex === idx
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {format(new Date(slot.startTime), 'HH:mm')} –{' '}
                      {format(new Date(slot.endTime), 'HH:mm')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

export default DateTimePicker;
