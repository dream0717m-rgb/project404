import React, { useState } from 'react';
import { ScheduleBlock, ActivityCategory } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (block: ScheduleBlock) => void;
  language: 'mn' | 'en';
}

const DAYS = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'] as const;
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const AddScheduleModal: React.FC<Props> = ({ isOpen, onClose, onAddBlock, language }) => {
  const [dayIndex, setDayIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('15:00');
  const [endTime, setEndTime] = useState('17:00');
  const [category, setCategory] = useState<ActivityCategory>('tutoring');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Calculate approximate duration
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    let dur = (eh * 60 + em - (sh * 60 + sm)) / 60;
    if (dur <= 0) dur = 1.5;

    const block: ScheduleBlock = {
      id: `block-${Date.now()}`,
      dayIndex,
      dayName: DAYS[dayIndex],
      dayEn: DAYS_EN[dayIndex],
      startTime,
      endTime,
      durationHours: Number(dur.toFixed(1)),
      title: title.trim(),
      category,
      location: location.trim() || undefined,
    };

    onAddBlock(block);
    setTitle('');
    setLocation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-base">
            {language === 'mn' ? 'Хичээл / Үйл ажиллагаа нэмэх' : 'Add Activity to Schedule'}
          </h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Гараг:</label>
            <select
              value={dayIndex}
              onChange={(e) => setDayIndex(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              {DAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d} ({DAYS_EN[i]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Нэр / Гарчиг:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Жишээ: ЭЕШ Математик давталт, Сагсан бөмбөг, Улаан загалмайн уулзалт"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Эхлэх цаг:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Дуусах цаг:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ангилал:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="school">Сургуулийн хичээл</option>
              <option value="tutoring">Давталт / Дамжаа</option>
              <option value="homework">Гэрийн даалгавар / ЭЕШ бэлтгэл</option>
              <option value="sport">Спорт & Дасгал</option>
              <option value="volunteer">Сайн дурын ажил</option>
              <option value="club">Дугуйлан / Сонирхол</option>
              <option value="rest">Чөлөөт цаг / Амралт</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Байршил (Заавал биш):
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Жишээ: 1-р сургууль, Hub төв, Гэртээ"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              Нэмэх
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
