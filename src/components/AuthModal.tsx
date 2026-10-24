import React, { useState } from 'react';
import { UserRole, AuthUser } from '../types';
import {
  X,
  User,
  GraduationCap,
  Users,
  LogIn,
  UserPlus,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser, token: string) => void;
  initialRole?: UserRole;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRole = 'student',
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('111-р сургууль');
  const [grade, setGrade] = useState('12-A');
  const [subject, setSubject] = useState('Физик & Эко клуб');
  const [childName, setChildName] = useState('Мөрөөдөл (12-A)');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1-Click Fast Demo Login
  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    setErrorMsg(null);
    let demoEmail = 'muruudul@erxes.io';
    if (role === 'teacher') demoEmail = 'bold@erxes.io';
    if (role === 'parent') demoEmail = 'batbayar@erxes.io';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password', role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Нэвтрэхэд алдаа гарлаа');
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Холболтын алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signin') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            role: selectedRole,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Нэвтрэхэд алдаа гарлаа');
        onSuccess(data.user, data.token);
        onClose();
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            role: selectedRole,
            school,
            grade: selectedRole === 'student' ? grade : undefined,
            subject: selectedRole === 'teacher' ? subject : undefined,
            childName: selectedRole === 'parent' ? childName : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Бүртгүүлэхэд алдаа гарлаа');
        onSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header with Title & Close */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Хаах"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center font-black text-white text-sm">
              e
            </div>
            <span className="font-extrabold tracking-tight text-base">
              erxes <span className="text-violet-400">BalanceEd</span>
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">
            {mode === 'signin' ? 'Системд нэвтрэх' : 'Шинээр бүртгүүлэх'}
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            Сурагч, багш, эцэг эхийн нэгдсэн эрүүл ачааллын систем
          </p>
        </div>

        {/* Tab Controls: Sign In / Sign Up */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Нэвтрэх (Sign In)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Бүртгүүлэх (Sign Up)</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 1-Click Instant Demo Login Banner */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-violet-900 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Шуурхай Турших (1-Click Demo)
              </span>
              <span className="text-[10px] text-violet-600 font-medium">Нууц үг шаардлагагүй</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                disabled={loading}
                className="py-1.5 px-2 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-[11px] font-bold text-indigo-700 flex flex-col items-center gap-0.5 transition-all text-center"
              >
                <span className="text-sm">👨‍🎓</span>
                <span>Мөрөөдөл</span>
                <span className="text-[9px] text-slate-500 font-normal">Сурагч</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                disabled={loading}
                className="py-1.5 px-2 rounded-lg bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-[11px] font-bold text-emerald-700 flex flex-col items-center gap-0.5 transition-all text-center"
              >
                <span className="text-sm">👨‍🏫</span>
                <span>Болд багш</span>
                <span className="text-[9px] text-slate-500 font-normal">Багш</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('parent')}
                disabled={loading}
                className="py-1.5 px-2 rounded-lg bg-white border border-violet-200 hover:border-violet-400 hover:bg-violet-50/50 text-[11px] font-bold text-violet-700 flex flex-col items-center gap-0.5 transition-all text-center"
              >
                <span className="text-sm">👨‍👩‍👧</span>
                <span>Баярхүү</span>
                <span className="text-[9px] text-slate-500 font-normal">Эцэг эх</span>
              </button>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Хэрэглэгчийн үүрэг (Select Role)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2 px-2 rounded-lg text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'student'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-800 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-indigo-600" />
                <span>Сурагч</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={`py-2 px-2 rounded-lg text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'teacher'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Багш</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('parent')}
                className={`py-2 px-2 rounded-lg text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'parent'
                    ? 'border-violet-600 bg-violet-50 text-violet-800 ring-1 ring-violet-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 text-violet-600" />
                <span>Эцэг эх</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Овог нэр (Full Name)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    selectedRole === 'student'
                      ? 'Жишээ: А. Мөрөөдөл'
                      : selectedRole === 'teacher'
                      ? 'Жишээ: Д. Болд багш'
                      : 'Жишээ: С. Баярхүү'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Имэйл хаяг (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'student'
                    ? 'muruudul@erxes.io'
                    : selectedRole === 'teacher'
                    ? 'bold@erxes.io'
                    : 'batbayar@erxes.io'
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Нууц үг (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Role-specific fields for Signup */}
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Сургууль
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {selectedRole === 'student' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Анги бүлэг
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="12-A"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {selectedRole === 'teacher' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Заадаг хичээл
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Физик"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {selectedRole === 'parent' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Хүүхдийн нэр
                    </label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Мөрөөдөл (12-A)"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Уншиж байна...</span>
                </>
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Нэвтрэх (Sign In)</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Бүртгүүлэх (Sign Up)</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
