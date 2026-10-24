import React from 'react';
import { UserRole } from '../types';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Volume2,
  Eye,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  HeartPulse,
  BrainCircuit,
  Compass,
  GraduationCap,
  Users,
  User,
  Zap,
} from 'lucide-react';

interface Props {
  onOpenAuth: (initialMode: 'signin' | 'signup', role?: UserRole) => void;
  onQuickDemo: (role: UserRole) => void;
}

export const LandingPage: React.FC<Props> = ({ onOpenAuth, onQuickDemo }) => {
  return (
    <div className="space-y-16 py-4">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-14 border border-slate-800 shadow-2xl">
        {/* Subtle decorative glowing background */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Gemma 4 AI • erxes Plugin Architecture</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Сурагчийн ачааллыг тэнцвэржүүлж,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400">
              хөгжих боломжийг
            </span>{' '}
            нээх экосистем
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            <strong>erxes BalanceEd</strong> нь ахлах ангийн сурагчдын хэт их ачаалал, хичээлийн давхцал,
            нойр дутагдлыг <strong>Gemma 4 AI</strong>-ийн тусламжтайгаар бодит цагт илрүүлж,
            <strong> Сурагч · Багш · Эцэг эхийн</strong> гурвалсан хамтын ажиллагаагаар тэнцвэртэй шийддэг
            нээлттэй платформ юм.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Системд нэвтрэх</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('signup')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Шинээр бүртгүүлэх
            </button>

            {/* Instant Demo Launch */}
            <div className="w-full sm:w-auto pt-2 sm:pt-0 sm:pl-3 sm:border-l border-white/15 flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                Шууд турших:
              </span>
              <button
                onClick={() => onQuickDemo('student')}
                className="px-2.5 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-medium"
              >
                👨‍🎓 Сурагч
              </button>
              <button
                onClick={() => onQuickDemo('teacher')}
                className="px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-medium"
              >
                👨‍🏫 Багш
              </button>
              <button
                onClick={() => onQuickDemo('parent')}
                className="px-2.5 py-1 rounded-md bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border border-violet-400/30 font-medium"
              >
                👨‍👩‍👧 Эцэг эх
              </button>
            </div>
          </div>

          {/* Unboxed Metadata Stats */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div>
              <div className="text-xl font-bold text-white">100%</div>
              <div className="text-slate-400 text-[11px]">Бодит цагийн синхрончлол</div>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div>
              <div className="text-xl font-bold text-emerald-400">1–10</div>
              <div className="text-slate-400 text-[11px]">Gemma 4 Ачааллын индекс</div>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div>
              <div className="text-xl font-bold text-indigo-400">FREE SLOTS</div>
              <div className="text-slate-400 text-[11px]">Сул цагийн боломж олголт</div>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div>
              <div className="text-xl font-bold text-violet-400">WCAG AA</div>
              <div className="text-slate-400 text-[11px]">Хүртээмж & Дуут туслах</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM VS SOLUTION */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Яагаад <span className="text-violet-600">erxes BalanceEd</span> хэрэгтэй вэ?
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            Ахлах ангийн сурагчид өдөр бүр даалгавар, давтлага, шалгалт дунд ядрах биш,
            эрүүл тэнцвэртэйгээр ирээдүйдээ бэлтгэх боломжтой.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Problem Card */}
          <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-800">
              <div className="p-2 rounded-xl bg-rose-100">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base">Одоо тулгарч буй хүндрэлүүд</h3>
                <p className="text-xs text-rose-600">Уламжлалт уялдаагүй систем</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>
                  <strong>Давхардсан дарамт:</strong> Олон багш нэг өдөр шалгалт ба том бие даалт
                  зэрэг зарласнаас үүдэх стресс, шөнийн нойр дутагдал.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>
                  <strong>Хувийн амьдрал хаягдах:</strong> Спорт, урлаг, дүүгээ харах, сайн дурын ажил
                  зэрэг хувийн хэрэгцээ нь хуваарьт тусгагдахгүй өнгөрдөг.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>
                  <strong>Эцэг эхийн мэдээллийн хоцрогдол:</strong> Хүүхдээ хэр их ачаалалтай байгааг
                  бодитоор хянаж туслах боломж дутмаг.
                </span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-800">
              <div className="p-2 rounded-xl bg-emerald-100">
                <HeartPulse className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-base">erxes BalanceEd шийдэл</h3>
                <p className="text-xs text-emerald-700">Gemma 4 AI & Гурвалсан нэгдмэл систем</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>
                  <strong>AI Ачааллын индекс (1–10):</strong> Хичээл, спорт, гэрийн ажил бүрийг
                  тооцож Gemma 4 загвар өдөр тутмын стрессийн эрсдэлийг хянана.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>
                  <strong>Багшийн 1-товчлуурт зохицуулалт:</strong> Давхцал илэрсэн даруйд багш
                  бие даалтын хугацааг шууд сунгах зөвлөмжийг хүлээн авна.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>
                  <strong>Чөлөөт цагийн ухаалаг тохируулга:</strong> Сурагчийн сонирхолд нийцсэн тэтгэлэг,
                  сайн дурын ажлыг ногоон <em>FREE SLOT</em> цагт автоматаар тааруулна.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. TRIPARTITE ROLES SHOWCASE */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>Гурвалсан уялдаа (Tripartite Sync)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Оролцогч тал бүрт зориулсан тусгай самбар
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            Сурагч, багш, эцэг эх бүр өөрийн хэрэгцээнд тохирсон дэлгэцээр бодит цагт холбогдоно.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Role 1: Student */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Сурагч</span>
                <h3 className="text-lg font-bold text-slate-900">Хувийн Хуваарь & Ахиц</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                7 хоногийн матрицыг удирдах, хувийн үйл ажиллагаа нэмэх/хасах, даалгавраа чеклэх,
                Gemma 4-өөс өөрт тохирох дугуйлан, тэтгэлэг санал болгох холбоосыг нээх.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded">Хувийн үйл ажиллагаа</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">Free Slot Match</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">Даалгаврын %</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={() => onQuickDemo('student')}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Сурагчийн самбараар турших</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Role 2: Teacher */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Багш</span>
                <h3 className="text-lg font-bold text-slate-900">Даалгавар & Зохицуулагч</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Шалгалт болон бие даалт байршуулах, ангийн нийт ачааллын графикаар давхцлыг шалгах,
                Gemma 4-ийн зөвлөснөөр 1 товшилтоор хугацааг уян хатан сунгах.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded">Шалгалт бүртгэх</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">1-Click Auto Extend</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">Ачааллын дүн шинжилгээ</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={() => onQuickDemo('teacher')}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Багшийн самбараар турших</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Role 3: Parent */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">Эцэг эх</span>
                <h3 className="text-lg font-bold text-slate-900">Баталгаажуулалт & Тайлан</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Хүүхдийнхээ 7 хоногийн хуваарьтай танилцаж албан ёсоор батлах,
                хичээлийн биелэлтийн графикийг харах, Gemma 4-ийн монгол дуут дүгнэлтийг сонсох.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded">Хуваарь батлах</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">Монгол дуут тайлан</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">Эрүүл мэндийн хяналт</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={() => onQuickDemo('parent')}
                className="w-full py-2.5 px-3 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Эцэг эхийн самбараар турших</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES MATRIX */}
      <section className="bg-slate-100 rounded-3xl p-8 md:p-12 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700">Гол технологи</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Суралцахуй болон амьдралын төгс тэнцвэр
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            Олон улсын EdTech стандартын дагуу бүтээгдсэн өндөр гүйцэтгэлтэй бүрэлдэхүүн хэсгүүд.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Gemma 4 AI Engine</h4>
            <p className="text-xs text-slate-600 leading-normal">
              Оюутны 7 хоногийн нийт цаг, шалгалтын тоо, гэрийн даалгаврын хувийг хослуулан 1-10 оноогоор стрессийн эрсдэлийг тодорхойлно.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Dynamic Schedule Matrix</h4>
            <p className="text-xs text-slate-600 leading-normal">
              Хувийн үйл ажиллагааг чөлөөтэй нэмж хасна. Устгахад тухайн цаг нь ногоон FREE SLOT болж хувирна.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Opportunity Matchmaker</h4>
            <p className="text-xs text-slate-600 leading-normal">
              Сурагчийн сонирхол ба сул цагт нийцсэн Олимпиад, роботик, тэтгэлэгт хөтөлбөрүүдийг автоматаар санал болгоно.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Parent Verification Sign-off</h4>
            <p className="text-xs text-slate-600 leading-normal">
              Хуваарь өөрчлөгдөх бүрт эцэг эхийн баталгаажуулалт шаардаж, гэр бүлийн харилцан итгэлцлийг бэхжүүлнэ.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ACCESSIBILITY & OPEN SOURCE ERXES BENEFIT */}
      <section className="rounded-3xl border border-slate-200 p-8 md:p-10 bg-white grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
            <Eye className="w-3.5 h-3.5" />
            <span>Universal Design & Accessibility</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Хүн бүрд хүртээмжтэй суралцах орчин
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Бид ямар ч хэрэглэгчийг орхигдуулахгүй байх үүднээс дэлхийн хүртээмжийн стандарт (WCAG AA),
            өндөр тодролттой харанхуй горим, дислексийн эсрэг тусгай фонт болон монгол хэл дээрх
            Web Speech дуут уншигчийг бүрэн нэвтрүүлсэн.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Өндөр тодролттой горим</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Dyslexia-friendly Font</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Монгол дуут синтезатор</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>JSON Schema хяналт</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4">
          <div className="flex items-center gap-2 text-violet-400 font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>erxes Open-Source Plugin Ready</span>
          </div>
          <h4 className="text-lg font-bold">Сургуулийн системтэй хялбар нэгдэнэ</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            erxes XOS архитектурт суурилсан учир ерөнхий боловсролын сургуулиуд нэмэлт үнэтэй програм хангамж
            худалдаж авалгүйгээр шууд залгаас (plugin) байдлаар суулган ашиглах бүрэн боломжтой.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('signup')}
              className="py-2 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors"
            >
              Сургуулиа бүртгэх
            </button>
            <button
              onClick={() => onQuickDemo('teacher')}
              className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              Багшийн консол үзэх
            </button>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-600 to-slate-900 text-white p-8 md:p-12 text-center space-y-6 shadow-xl">
        <h2 className="text-2xl md:text-4xl font-extrabold max-w-xl mx-auto leading-tight">
          Тэнцвэртэй боловсрол, эрүүл ирээдүйн аяллаа өнөөдөр эхлүүлээрэй
        </h2>
        <p className="text-xs md:text-sm text-indigo-100 max-w-lg mx-auto">
          Сурагч, багш эсвэл эцэг эхийн эрхээр системд нэвтэрч Gemma 4 AI ачааллын зохицуулалтыг бодитоор туршаарай.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
          <button
            onClick={() => onOpenAuth('signin')}
            className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs md:text-sm shadow-md transition-all hover:scale-105"
          >
            Нэвтрэх / Систем рүү орох
          </button>
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs md:text-sm transition-all"
          >
            Шинэ бүртгэл үүсгэх
          </button>
        </div>
      </section>
    </div>
  );
};
