import React from 'react';
import { StudentProfile } from '../types';
import { User, School, Target, Award, Moon, Sparkles, Check } from 'lucide-react';

interface Props {
  students: StudentProfile[];
  currentStudent: StudentProfile;
  onSelectStudent: (student: StudentProfile) => void;
  language: 'mn' | 'en';
}

export const StudentProfileBar: React.FC<Props> = ({
  students,
  currentStudent,
  onSelectStudent,
  language,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Student selection pill tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {language === 'mn' ? 'Сурагчийн профайл сонгох:' : 'Select Student Profile:'}
        </span>

        <div className="flex flex-wrap gap-2">
          {students.map((st) => {
            const isSelected = st.id === currentStudent.id;
            return (
              <button
                key={st.id}
                onClick={() => onSelectStudent(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <img
                  src={st.avatar}
                  alt={st.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>{st.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-violet-700' : 'bg-slate-200 text-slate-600'}`}>
                  {st.grade}-р анги
                </span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Student Details Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={currentStudent.avatar}
            alt={currentStudent.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500/30 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{currentStudent.name}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                {currentStudent.grade}-р анги
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {currentStudent.schoolShift}
              </span>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
              <School className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentStudent.school}</span>
            </p>
          </div>
        </div>

        {/* Interests & Targets */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">
              {language === 'mn' ? 'Зорилтот мэргэжил:' : 'Career Goal:'}
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-rose-500" />
              {currentStudent.targetCareer}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium block">
              {language === 'mn' ? 'Шалгалт / ЭЕШ:' : 'Target Exam:'}
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              {currentStudent.targetExam}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium block">
              {language === 'mn' ? 'Нойрны зорилт:' : 'Sleep Target:'}
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              {currentStudent.sleepGoalHours} цаг/шөнө
            </span>
          </div>
        </div>
      </div>

      {/* Interests tags */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-[11px] text-slate-400 font-medium">Сонирхол ба авьяас:</span>
        {currentStudent.interests.map((interest) => (
          <span
            key={interest}
            className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            #{interest}
          </span>
        ))}
        {currentStudent.personalMotto && (
          <span className="text-xs text-indigo-600 italic ml-auto hidden md:inline">
            "{currentStudent.personalMotto}"
          </span>
        )}
      </div>
    </div>
  );
};
