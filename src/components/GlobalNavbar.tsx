import React from 'react';
import { UserRole } from '../types';
import {
  Sparkles,
  Volume2,
  Eye,
  Type,
  CheckCircle2,
  Radio,
  User,
  GraduationCap,
  Users,
  TrendingUp,
} from 'lucide-react';

interface Props {
  currentRole: UserRole;
  activeView?: UserRole | 'progress';
  onSelectRole: (role: UserRole) => void;
  onSelectView?: (view: UserRole | 'progress') => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  dyslexiaFont: boolean;
  onToggleDyslexiaFont: () => void;
  onVoiceCommand: () => void;
  isSpeaking: boolean;
  lastSyncTime?: string;
  completionPercentage: number;
  isParentApproved: boolean;
}

export const GlobalNavbar: React.FC<Props> = ({
  currentRole,
  activeView,
  onSelectRole,
  onSelectView,
  highContrast,
  onToggleHighContrast,
  dyslexiaFont,
  onToggleDyslexiaFont,
  onVoiceCommand,
  isSpeaking,
  lastSyncTime,
  completionPercentage,
  isParentApproved,
}) => {
  // Current logged in user info based on role
  const getRoleUserBadge = () => {
    switch (currentRole) {
      case 'student':
        return {
          title: 'Мөрөөдөл (Student)',
          subtitle: '12-A анги • 111-р сургууль',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          roleColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
        };
      case 'teacher':
        return {
          title: 'Болд багш (Teacher)',
          subtitle: 'Физик & Эко клуб хариуцсан',
          avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=120&auto=format&fit=crop&q=80',
          roleColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
        };
      case 'parent':
        return {
          title: 'Баярхүү (Parent)',
          subtitle: 'Мөрөөдлийн эцэг эх',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          roleColor: 'bg-violet-500/10 text-violet-700 border-violet-200',
        };
    }
  };

  const userBadge = getRoleUserBadge();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with branding, live sync status & accessibility toolbar */}
        <div className="flex items-center justify-between h-14 border-b border-slate-100 text-xs">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
              e
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                erxes <span className="text-violet-600">BalanceEd</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-violet-600" />
                Gemma 4 Multi-Role Sync
              </span>
            </div>
          </div>

          {/* Sync indicator + Universal Accessibility Toolbar */}
          <div className="flex items-center gap-2">
            {/* Live Sync Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>Синхрончлогдсон (Live State)</span>
            </div>

            {/* Accessibility: High Contrast */}
            <button
              onClick={onToggleHighContrast}
              title="High Contrast Mode (Өндөр тодрол)"
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                highContrast
                  ? 'bg-slate-900 text-yellow-300 border-yellow-400 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Тодрол</span>
            </button>

            {/* Accessibility: Dyslexia Font */}
            <button
              onClick={onToggleDyslexiaFont}
              title="Dyslexia-friendly Font (Хялбар уншигдах фонт)"
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                dyslexiaFont
                  ? 'bg-violet-600 text-white border-violet-700 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Фонт</span>
            </button>

            {/* Accessibility: Voice Assistant */}
            <button
              onClick={onVoiceCommand}
              title="Gemma 4 Voice Reader (Дүгнэлтийг сонсох)"
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-900 border-amber-500 animate-pulse font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isSpeaking ? 'Ярьж байна' : 'Дуугаар сонсох'}</span>
            </button>
          </div>
        </div>

        {/* Bottom bar: Role Selector Switcher & User Profile Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-3">
          {/* 3-Role Switcher Buttons + Progress Dashboard Tab */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl flex-wrap">
            <button
              onClick={() => onSelectRole('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentRole === 'student' && activeView !== 'progress'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>👨‍🎓 Сурагч</span>
            </button>

            <button
              onClick={() => onSelectRole('teacher')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentRole === 'teacher' && activeView !== 'progress'
                  ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>👨‍🏫 Багш</span>
            </button>

            <button
              onClick={() => onSelectRole('parent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentRole === 'parent' && activeView !== 'progress'
                  ? 'bg-white text-violet-700 shadow-xs ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-violet-600" />
              <span>👨‍👩‍👧 Эцэг эх</span>
            </button>

            <button
              onClick={() => onSelectView ? onSelectView('progress') : null}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeView === 'progress'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                  : 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
              <span>📊 Ахиц & Ачаалал (Progress)</span>
            </button>
          </div>

          {/* Current User Profile Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2">
              <img
                src={userBadge.avatar}
                alt={userBadge.title}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/20"
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-xs">{userBadge.title}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${userBadge.roleColor}`}>
                    {currentRole.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{userBadge.subtitle}</p>
              </div>
            </div>

            {/* Quick status pill */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] pl-3 border-l border-slate-200">
              <span className="font-semibold text-slate-700">Даалгавар: {completionPercentage}%</span>
              <span>•</span>
              <span className={isParentApproved ? 'text-emerald-600 font-semibold flex items-center gap-1' : 'text-amber-600'}>
                {isParentApproved ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Баталгаажсан
                  </>
                ) : (
                  'Хүлээгдэж буй'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
