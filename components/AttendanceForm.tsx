
import React, { useState } from 'react';
import { ALL_PUPILS, TEACHERS } from '../constants';
import { Subject, SUBJECT_EMOJIS, TIME_SLOTS, AttendanceRecord } from '../types';
import { Clock, User, BookOpen, Calendar, Save, CheckCircle, ChevronDown, Users, Cloud, RefreshCw, Link, Plus, Trash2 } from 'lucide-react';

interface AttendanceFormProps {
  onSave: (record: AttendanceRecord) => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState(Subject.BM);
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHERS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0].label);
  const [attendance, setAttendance] = useState<{ [id: string]: boolean }>({});
  const [teachingMaterialLinks, setTeachingMaterialLinks] = useState<string[]>(['']);
  const [expandedYears, setExpandedYears] = useState<{ [year: number]: boolean }>({ 
    1: true, 2: false, 3: false, 4: false, 5: false, 6: false 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleStudent = (id: string) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleYear = (year: number) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  const selectAllInYear = (year: number, pupils: any[]) => {
    const newAttendance = { ...attendance };
    const allSelected = pupils.every(p => attendance[p.id]);
    
    pupils.forEach(p => {
      newAttendance[p.id] = !allSelected;
    });
    setAttendance(newAttendance);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...teachingMaterialLinks];
    newLinks[index] = value;
    setTeachingMaterialLinks(newLinks);
  };

  const addLinkField = () => {
    if (teachingMaterialLinks.length < 4) {
      setTeachingMaterialLinks([...teachingMaterialLinks, '']);
    }
  };

  const removeLinkField = (index: number) => {
    const newLinks = teachingMaterialLinks.filter((_, i) => i !== index);
    setTeachingMaterialLinks(newLinks.length === 0 ? [''] : newLinks);
  };

  const handleSave = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const filteredLinks = teachingMaterialLinks.filter(link => link.trim() !== '');

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date,
      time: selectedTime,
      subject: selectedSubject,
      teacher: selectedTeacher,
      timestamp: new Date().toLocaleTimeString(),
      attendance,
      teachingMaterialLinks: filteredLinks
    };

    setTimeout(() => {
      onSave(newRecord);
      setIsSubmitting(false);
      setAttendance({});
      setTeachingMaterialLinks(['']);
    }, 800);
  };

  const resetAttendance = () => {
    if (confirm("Adakah anda pasti untuk reset semua pilihan kehadiran murid?")) {
      setAttendance({});
    }
  };

  const groupedPupils = [1, 2, 3, 4, 5, 6].map(year => ({
    year,
    pupils: ALL_PUPILS.filter(p => p.year === year)
  }));

  return (
    <div className="space-y-8 animate-fadeIn pb-32">
      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400 mb-2">
            <Calendar size={14} /> Tarikh Sesi
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
          />
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400 mb-2">
            <BookOpen size={14} /> Subjek
          </label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value as Subject)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
          >
            {Object.values(Subject).map(subj => (
              <option key={subj} value={subj}>{SUBJECT_EMOJIS[subj]} {subj}</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400 mb-2">
            <User size={14} /> Guru Pembimbing
          </label>
          <select 
            value={selectedTeacher} 
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
          >
            {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-400 mb-2">
            <Clock size={14} /> Slot Masa
          </label>
          <select 
            value={selectedTime} 
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
          >
            {TIME_SLOTS.map(slot => (
              <option key={slot.id} value={slot.label}>{slot.emoji} {slot.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Link Bahan Section */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-xs font-black uppercase text-zinc-400 tracking-widest">
            <Link size={16} className="text-yellow-500" /> Link Bahan Mengajar (Maksimum 4)
          </label>
          {teachingMaterialLinks.length < 4 && (
            <button 
              onClick={addLinkField}
              className="flex items-center gap-1 text-[10px] font-black uppercase text-yellow-600 dark:text-yellow-400 hover:opacity-80 transition-all bg-yellow-400/10 px-3 py-1.5 rounded-full"
            >
              <Plus size={12} /> Tambah Link
            </button>
          )}
        </div>
        <div className="space-y-3">
          {teachingMaterialLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <input 
                type="url"
                placeholder={`Link ${index + 1} (e.g., https://...)`}
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-yellow-400 font-medium text-sm"
              />
              {teachingMaterialLinks.length > 1 && (
                <button 
                  onClick={() => removeLinkField(index)}
                  className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100 dark:border-red-900/50"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-zinc-400 mt-3 italic">* Contoh: Google Drive, Canva, Wordwall, atau YouTube.</p>
      </div>

      {/* Pupils List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-zinc-900 dark:bg-yellow-400 p-5 rounded-2xl text-white dark:text-black shadow-lg">
          <div className="flex flex-col">
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-tight">
              <Users size={20} className="text-yellow-400 dark:text-black" /> 
              Rekod Kehadiran Murid
            </h3>
            <p className="text-[10px] opacity-70 mt-1 uppercase tracking-tighter font-bold">Tanda setiap murid secara individu</p>
          </div>
          <button 
            onClick={resetAttendance} 
            className="text-xs font-black bg-white/10 dark:bg-black/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/5 uppercase tracking-widest"
          >
            Reset Semua
          </button>
        </div>

        <div className="space-y-3">
          {groupedPupils.map(group => {
            const presentCount = group.pupils.filter(p => attendance[p.id]).length;
            const isExpanded = expandedYears[group.year];
            
            return (
              <div key={group.year} className="overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all">
                <div 
                  onClick={() => toggleYear(group.year)}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isExpanded ? 'bg-zinc-50 dark:bg-zinc-800/50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-900 dark:bg-yellow-400 text-yellow-400 dark:text-black w-10 h-10 flex items-center justify-center rounded-xl text-sm font-black">
                      T{group.year}
                    </div>
                    <div>
                      <h4 className="font-bold text-base">Kelas Tahun {group.year}</h4>
                      <p className={`text-[10px] uppercase tracking-wider font-bold ${presentCount > 0 ? 'text-green-500' : 'text-zinc-400'}`}>
                        {presentCount} / {group.pupils.length} Murid Hadir
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAllInYear(group.year, group.pupils);
                      }}
                      className="hidden sm:block text-[10px] font-black uppercase text-yellow-600 dark:text-yellow-500 bg-yellow-500/5 px-2 py-1 rounded-md hover:bg-yellow-500/10 transition-all"
                    >
                      {presentCount === group.pupils.length ? 'Batal Semua' : 'Pilih Semua'}
                    </button>
                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} className="text-zinc-400" />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 animate-slideDown bg-white dark:bg-zinc-900/50">
                    {group.pupils.map(p => (
                      <label 
                        key={p.id} 
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                          attendance[p.id] 
                            ? 'bg-yellow-400 border-yellow-400 text-black font-semibold shadow-sm' 
                            : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 hover:border-yellow-400'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={!!attendance[p.id]} 
                          onChange={() => toggleStudent(p.id)}
                        />
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors ${attendance[p.id] ? 'bg-black border-black text-white' : 'bg-white dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600'}`}>
                          {attendance[p.id] && <CheckCircle size={14} strokeWidth={4} />}
                        </div>
                        <span className="text-xs font-bold truncate tracking-tight uppercase">{p.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-[60]">
        <div className="flex flex-col gap-2">
          {isSubmitting && (
            <div className="bg-zinc-900 text-white text-[10px] font-bold py-1.5 px-4 rounded-full self-center flex items-center gap-2 animate-bounce shadow-xl">
              <Cloud size={12} className="text-yellow-400 animate-pulse" /> Data Sedang Disimpan...
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transform transition-all active:scale-95 border-2 border-black/10 group ${isSubmitting ? 'opacity-70 grayscale cursor-not-allowed' : 'hover:scale-[1.02]'}`}
          >
            {isSubmitting ? (
              <RefreshCw size={22} className="animate-spin" />
            ) : (
              <>
                <Save size={22} className="group-hover:rotate-12 transition-transform" /> 
                <span className="uppercase tracking-widest text-base">HANTAR REKOD KEHADIRAN</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
