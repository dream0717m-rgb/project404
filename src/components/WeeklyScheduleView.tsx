import React, { useState } from 'react';
import { WeeklySchedule, ScheduleBlock, ActivityCategory } from '../types';
import {
  Calendar,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle2,
  BookOpen,
  Dumbbell,
  GraduationCap,
  Sparkles,
  Coffee,
  Heart,
} from 'lucide-react';

interface Props {
  schedule: WeeklySchedule;
  studentName: string;
  onUpdateSchedule: (updatedSchedule: WeeklySchedule) => void;
  onOpenAddModal: () => void;
  language: 'mn' | 'en';
}

const DAYS = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'] as const;
const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const WeeklyScheduleView: React.FC<Props> = ({
  schedule,
  studentName,
  onUpdateSchedule,
  onOpenAddModal,
  language,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [signerName, setSignerName] = useState(schedule.parentName || '');

  // Calculate statistics
  let totalHours = 0;
  let academicHours = 0;
  let sportHours = 0;
  let volunteerHours = 0;
  let restHours = 0;

  schedule.blocks.forEach((b) => {
    const dur = b.durationHours || 1.5;
    totalHours += dur;
    if (b.category === 'school' || b.category === 'homework' || b.category === 'tutoring') {
      academicHours += dur;
    } else if (b.category === 'sport') {
      sportHours += dur;
    } else if (b.category === 'volunteer') {
      volunteerHours += dur;
    } else if (b.category === 'rest') {
      restHours += dur;
    }
  });

  const getCategoryBadge = (cat: ActivityCategory | string) => {
    switch (cat) {
      case 'school':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: language === 'mn' ? 'Хичээл' : 'School',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'tutoring':
        return {
          icon: <GraduationCap className="w-3.5 h-3.5" />,
          label: language === 'mn' ? 'Давталт' : 'Tutoring',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'homework':
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: language === 'mn' ? 'Бие даалт' : 'Homework',
          bg: 'bg-violet-50 text-violet-700 border-violet-200',
        };
      case 'sport':
        return {
          icon: <Dumbbell className="w-3.5 h-3.5" />,
          label: language === 'mn' ? 'Спорт' : 'Sport',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'volunteer':
        return {
          icon: <Heart className="w-3.5 h-3.5" />,
          label: language === 'mn' ? 'Сайн дур' : 'Volunteer',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'club':
        return {
          icon: <Sparkles className="w-3.5 h-3.5" />,
          label: language === 'mn' ? 'Клуб/Дугуйлан' : 'Club',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'rest':
      default:
        return {
          icon: <Coffee className="w-3.5 h-3.5" />,
          label: language === 'mn' ? 'Амралт/Чөлөөт' : 'Rest/Free',
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
        };
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    const updated = {
      ...schedule,
      blocks: schedule.blocks.filter((b) => b.id !== blockId),
    };
    onUpdateSchedule(updated);
  };

  const handleParentVerify = () => {
    const updated: WeeklySchedule = {
      ...schedule,
      verifiedByParent: true,
      parentName: signerName.trim() || 'Асран хамгаалагч',
      verifiedDate: new Date().toLocaleString('mn-MN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    onUpdateSchedule(updated);
    setShowVerifyModal(false);
  };

  const handleToggleVerification = () => {
    if (schedule.verifiedByParent) {
      onUpdateSchedule({
        ...schedule,
        verifiedByParent: false,
        verifiedDate: null,
      });
    } else {
      setShowVerifyModal(true);
    }
  };

  const currentDayBlocks = schedule.blocks.filter((b) => b.dayIndex === selectedDayIndex);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Top Header & Parent Verification Stamp */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'mn' ? 'Долоо хоногийн цагийн хуваарь' : 'Weekly Schedule Matrix'}
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
              {schedule.weekRange}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'mn'
              ? 'Эцэг эхээр хянагдсан бодит хуваарийн дагуу хиймэл оюун ачааллыг тооцдог'
              : 'Gemma 4 analyzes genuine schedule blocks verified by family.'}
          </p>
        </div>

        {/* Verification Status Banner & Button */}
        <div className="flex items-center gap-2">
          {schedule.verifiedByParent ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">
                  {language === 'mn' ? 'Эцэг эх баталгаажуулсан' : 'Verified by Parent'}
                </p>
                <p className="text-[10px] text-emerald-700/80">
                  {schedule.parentName} • {schedule.verifiedDate || 'Баталгаажсан'}
                </p>
              </div>
              <button
                onClick={handleToggleVerification}
                className="text-[10px] text-emerald-600 hover:text-emerald-800 underline ml-1"
                title="Баталгаажуулалтыг цуцлах"
              >
                {language === 'mn' ? 'Өөрчлөх' : 'Edit'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowVerifyModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600 animate-pulse" />
              <div className="text-left">
                <p className="text-xs font-bold">
                  {language === 'mn' ? 'Эцэг эхийн баталгаажуулалт хүлээгдэж байна' : 'Parent Verification Needed'}
                </p>
                <p className="text-[10px] text-amber-700/80">
                  {language === 'mn' ? 'Энд дарж баталгаажуулна уу' : 'Click to sign & verify'}
                </p>
              </div>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'mn' ? 'Хичээл/Үйл ажиллагаа нэмэх' : 'Add Block'}</span>
          </button>
        </div>
      </div>

      {/* Quick metrics bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <p className="text-[11px] font-medium text-slate-500">
            {language === 'mn' ? 'Нийт төлөвлөсөн цаг' : 'Total Weekly Load'}
          </p>
          <p className="text-lg font-bold text-slate-900">{totalHours.toFixed(1)} цаг</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
          <p className="text-[11px] font-medium text-blue-700">
            {language === 'mn' ? 'Хичээл & Давталт' : 'Academics & Study'}
          </p>
          <p className="text-lg font-bold text-blue-900">{academicHours.toFixed(1)} цаг</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
          <p className="text-[11px] font-medium text-amber-700">
            {language === 'mn' ? 'Спорт & Хөдөлгөөн' : 'Sports & Active'}
          </p>
          <p className="text-lg font-bold text-amber-900">{sportHours.toFixed(1)} цаг</p>
        </div>
        <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100">
          <p className="text-[11px] font-medium text-teal-700">
            {language === 'mn' ? 'Чөлөөт & Гэр бүл' : 'Rest & Wellbeing'}
          </p>
          <p className="text-lg font-bold text-teal-900">{restHours.toFixed(1)} цаг</p>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {DAYS.map((day, idx) => {
          const count = schedule.blocks.filter((b) => b.dayIndex === idx).length;
          const isSelected = selectedDayIndex === idx;

          return (
            <button
              key={day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
              }`}
            >
              <div className="text-xs">
                {language === 'mn' ? day : DAYS_EN[idx]}
              </div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                {count} {language === 'mn' ? 'үйл ажиллагаа' : 'items'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Schedule blocks list for the selected day */}
      <div className="space-y-2.5 min-h-[160px]">
        {currentDayBlocks.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <Coffee className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">
              {DAYS[selectedDayIndex]} гарагт хичээл төлөвлөгдөөгүй байна.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Энэ өдөр чөлөөт цаг, амралт эсвэл сайн дурын ажил төлөвлөх бүрэн боломжтой!
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              + Хичээл эсвэл дугуйлан нэмэх
            </button>
          </div>
        ) : (
          currentDayBlocks.map((block) => {
            const badge = getCategoryBadge(block.category);
            return (
              <div
                key={block.id}
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white flex items-center justify-between gap-3 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono font-semibold text-slate-500 w-24 shrink-0 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{block.startTime} - {block.endTime}</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800">{block.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 ${badge.bg}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
                    {block.location && (
                      <p className="text-xs text-slate-500">Байршил: {block.location}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                    {block.durationHours} цаг
                  </span>
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Устгах"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Parent Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  {language === 'mn' ? 'Эцэг эхийн баталгаажуулалт' : 'Parent Schedule Verification'}
                </h4>
                <p className="text-xs text-slate-500">
                  {studentName}-ийн 7 хоногийн хуваарьтай танилцаж баталгаажуулна уу
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200/80 leading-relaxed space-y-1.5">
              <p>
                Би <strong>{studentName}</strong>-ийн долоо хоногийн хичээл, давталт, спортын бэлтгэл болон чөлөөт цагийн хуваарь үнэн зөв болохыг баталж байна.
              </p>
              <p className="text-slate-500">
                Gemma 4 хиймэл оюун энэхүү хуваарь дээр тулгуурлан ачааллын стрессээс урьдчилан сэргийлэх зөвлөгөө болон тохирох боломжуудыг санал болгоно.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'mn' ? 'Баталгаажуулагч эцэг эх / асран хамгаалагчийн нэр:' : 'Parent / Guardian Full Name:'}
              </label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Жишээ: Оюунчимэг Дорж (Ээж)"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {language === 'mn' ? 'Цуцлах' : 'Cancel'}
              </button>
              <button
                onClick={handleParentVerify}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'mn' ? 'Баталгаажуулах' : 'Sign & Verify'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
