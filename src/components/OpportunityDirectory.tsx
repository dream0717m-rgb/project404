import React, { useState } from 'react';
import { OpportunityItem } from '../types';
import { Sparkles, Plus, Search, Building, Clock } from 'lucide-react';

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
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New opportunity form state
  const [newTitle, setNewTitle] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [newSkills, setNewSkills] = useState('Graphic Design, Digital Art');
  const [newTimeSlot, setNewTimeSlot] = useState('Friday 15:30-17:30');
  const [newLevel, setNewLevel] = useState('School Level');
  const [newDesc, setNewDesc] = useState('');

  const filtered = opportunities.filter((op) => {
    return (
      op.title.toLowerCase().includes(search.toLowerCase()) ||
      op.organizer.toLowerCase().includes(search.toLowerCase()) ||
      (op.descriptionMongolian && op.descriptionMongolian.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOrganizer.trim()) return;

    const created: OpportunityItem = {
      opportunityId: `OPP-${Date.now()}`,
      title: newTitle.trim(),
      organizer: newOrganizer.trim(),
      requiredSkills: newSkills.split(',').map((s) => s.trim()),
      timeSlot: newTimeSlot.trim() || 'Friday 15:30-17:30',
      level: newLevel,
      descriptionMongolian: newDesc.trim() || 'Сурагчдын бүтээлч хөгжлийг дэмжих боломж.',
    };

    onAddOpportunity(created);
    setShowCreateModal(false);
    setNewTitle('');
    setNewOrganizer('');
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
              ? 'Багш, сургуулиас санал болгож буй сайн дурын ажил, клуб болон төслүүд'
              : 'Verified opportunities from teachers, school clubs, and organizations'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'mn' ? 'Боломж нийтлэх' : 'Post Opportunity'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            language === 'mn'
              ? 'Боломж, зохион байгуулагчаар хайх...'
              : 'Search opportunities by title, organizer...'
          }
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Grid of opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((op) => (
          <div
            key={op.opportunityId}
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all bg-white flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                  {op.level}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{op.opportunityId}</span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{op.title}</h4>
              <p className="text-xs text-indigo-700 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                {op.organizer}
              </p>

              {op.descriptionMongolian && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {op.descriptionMongolian}
                </p>
              )}

              {op.requiredSkills && op.requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {op.requiredSkills.map((sk) => (
                    <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {op.timeSlot}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
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
                  placeholder="Жишээ: School Eco-Club Poster Design Volunteer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Зохион байгуулагч / Багш:
                </label>
                <input
                  type="text"
                  required
                  value={newOrganizer}
                  onChange={(e) => setNewOrganizer(e.target.value)}
                  placeholder="Жишээ: 111-р сургууль / Багш Болд"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Цагийн хуваарь:</label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="Friday 15:30-17:30"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Түвшин:</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="School Level">School Level</option>
                    <option value="City Level">City Level</option>
                    <option value="National Level">National Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Шаардагдах ур чадвар (таслалаар тусгаарлах):
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="Graphic Design, Digital Art"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Товч тайлбар:</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Үйл ажиллагааны зорилго, давуу тал..."
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
