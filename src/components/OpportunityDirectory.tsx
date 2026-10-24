import React, { useState } from 'react';
import { OpportunityItem } from '../types';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Building,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Tag,
} from 'lucide-react';

interface Props {
  opportunities: OpportunityItem[];
  onAddOpportunity: (item: OpportunityItem) => void;
  language: 'mn' | 'en';
}

export const OpportunityDirectory: React.FC<Props> = ({
  opportunities,
  onAddOpportunity,
  language,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProviderType, setSelectedProviderType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New opportunity form state
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newProviderType, setNewProviderType] = useState<'school' | 'teacher' | 'ngo' | 'global'>('teacher');
  const [newCategory, setNewCategory] = useState<'stem' | 'volunteer' | 'arts' | 'leadership' | 'sports' | 'language'>('stem');
  const [newHours, setNewHours] = useState(2);
  const [newDays, setNewDays] = useState('Бямба');
  const [newFormat, setNewFormat] = useState<'In-person' | 'Online' | 'Hybrid'>('Hybrid');
  const [newDesc, setNewDesc] = useState('');

  const filtered = opportunities.filter((op) => {
    const matchSearch =
      op.title.toLowerCase().includes(search.toLowerCase()) ||
      op.provider.toLowerCase().includes(search.toLowerCase()) ||
      op.descriptionMongolian.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || op.category === selectedCategory;
    const matchType = selectedProviderType === 'all' || op.providerType === selectedProviderType;
    return matchSearch && matchCat && matchType;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProvider.trim()) return;

    const created: OpportunityItem = {
      id: `op-${Date.now()}`,
      title: newTitle.trim(),
      titleEn: newTitle.trim(),
      provider: newProvider.trim(),
      providerType: newProviderType,
      category: newCategory,
      timeCommitmentHoursWeekly: Number(newHours) || 2,
      preferredDays: newDays.split(',').map((d) => d.trim()),
      format: newFormat,
      location: newFormat === 'Online' ? 'Цахим / Google Meet' : 'Улаанбаатар хот',
      skillsRequired: ['Идэвх санаачилга', 'Хамтран ажиллах чадвар'],
      descriptionMongolian: newDesc.trim() || 'Сурагчдын хувь хүний болон академик хөгжлийг дэмжих боломж.',
      deadline: '2026-12-31',
      contactPerson: 'Зохион байгуулагч',
    };

    onAddOpportunity(created);
    setShowCreateModal(false);
    // Reset form
    setNewTitle('');
    setNewProvider('');
    setNewDesc('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-lg">
              {language === 'mn' ? 'Боломжийн нэгдсэн сан (Opportunity Hub)' : 'Extracurricular & Volunteer Hub'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'mn'
              ? 'Багш, сургууль болон олон улсын байгууллагуудаас нийтэлсэн сайн дурын болон хөгжлийн хөтөлбөрүүд'
              : 'Verified opportunities from teachers, high schools, NGOs, and global partners'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'mn' ? 'Багш/Байгууллагын боломж нийтлэх' : 'Post Opportunity'}</span>
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === 'mn'
                ? 'Боломж, байгууллага, чиглэлээр хайх...'
                : 'Search opportunities by title, provider...'
            }
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{language === 'mn' ? 'Бүх чиглэл' : 'All Categories'}</option>
          <option value="stem">STEM & AI</option>
          <option value="volunteer">{language === 'mn' ? 'Сайн дурын ажил' : 'Volunteer'}</option>
          <option value="language">{language === 'mn' ? 'Англи хэл / Мэтгэлцээн' : 'Debate / Language'}</option>
          <option value="leadership">{language === 'mn' ? 'Манлайлал & Эко' : 'Leadership & Eco'}</option>
        </select>

        {/* Provider Type Filter */}
        <select
          value={selectedProviderType}
          onChange={(e) => setSelectedProviderType(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">{language === 'mn' ? 'Бүх нийтлэгч' : 'All Providers'}</option>
          <option value="teacher">{language === 'mn' ? 'Багш нар' : 'Teachers'}</option>
          <option value="school">{language === 'mn' ? 'Сургууль' : 'Schools'}</option>
          <option value="ngo">{language === 'mn' ? 'ТББ / Олон нийтийн' : 'NGOs'}</option>
          <option value="global">{language === 'mn' ? 'Олон улсын' : 'Global'}</option>
        </select>
      </div>

      {/* Grid of opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((op) => (
          <div
            key={op.id}
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all bg-white flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                  {op.category.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {op.providerType === 'teacher'
                    ? 'Багшийн санал'
                    : op.providerType === 'school'
                    ? 'Сургууль'
                    : op.providerType === 'ngo'
                    ? 'ТББ'
                    : 'Олон улсын'}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{op.title}</h4>
              <p className="text-xs text-indigo-700 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                {op.provider}
              </p>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {op.descriptionMongolian}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {op.timeCommitmentHoursWeekly}ц/7 хоногт
                </span>
                <span>•</span>
                <span>{op.format}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Хугацаа: {op.deadline}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding new opportunity */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'mn' ? 'Шинэ боломж нийтлэх' : 'Post New Opportunity'}
              </h4>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Гарчиг (Title):
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Жишээ: Англи хэлний ярианы клуб үе тэнгийнхэндээ"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Байгууллага / Багш:
                  </label>
                  <input
                    type="text"
                    required
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    placeholder="Жишээ: 1-р сургуулийн Англи хэлний тэнхим"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Төрөл:
                  </label>
                  <select
                    value={newProviderType}
                    onChange={(e) => setNewProviderType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="teacher">Багш (Teacher)</option>
                    <option value="school">Сургууль (School)</option>
                    <option value="ngo">ТББ (NGO)</option>
                    <option value="global">Олон улсын (Global)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Чиглэл:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="stem">STEM & AI</option>
                    <option value="volunteer">Сайн дур</option>
                    <option value="language">Хэл, мэтгэлцээн</option>
                    <option value="leadership">Манлайлал</option>
                    <option value="arts">Урлаг</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    7 хоногт (цаг):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Хэлбэр:
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Online">Online</option>
                    <option value="In-person">Танхим</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Товч тайлбар (Монгол хэлээр):
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Энэхүү үйл ажиллагааны зорилго, давуу тал..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                >
                  Нийтлэх
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
