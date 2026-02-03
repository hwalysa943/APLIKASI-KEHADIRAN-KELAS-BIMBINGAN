
import React, { useState } from 'react';
import { AttendanceRecord, SUBJECT_EMOJIS } from '../types';
import { Trash2, Download, Search, Clock, User, CheckCircle, Eye, Calendar, X, Link as LinkIcon } from 'lucide-react';
import { generateAttendancePDF } from '../utils/pdfGenerator';
import { OFFICIALS, ALL_PUPILS } from '../constants';

interface ReportViewProps {
  records: AttendanceRecord[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ records, onDelete, onClearAll }) => {
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<AttendanceRecord | null>(null);

  const filteredRecords = records.filter(r => {
    const matchesMonth = r.date.startsWith(filterMonth);
    const matchesSearch = r.teacher.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  const handleExportSelected = () => {
    const selectedRecords = records.filter(r => selectedIds.has(r.id));
    if (selectedRecords.length === 0) {
      alert("Sila pilih sekurang-kurangnya satu rekod untuk dieksport.");
      return;
    }
    generateAttendancePDF(selectedRecords, `Batch_${new Date().toLocaleDateString()}`);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const openPreview = (record: AttendanceRecord) => {
    setPreviewRecord(record);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Controls */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text"
              placeholder="Cari subjek/guru..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
            />
          </div>
          <input 
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
          />
          <div className="flex gap-2">
            <button 
              onClick={handleExportSelected}
              disabled={selectedIds.size === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-yellow-400 text-white dark:text-black font-black rounded-2xl transition-all active:scale-95 ${selectedIds.size === 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              <Download size={18} /> EXPORT ({selectedIds.size})
            </button>
            <button 
              onClick={onClearAll}
              className="p-3 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-400 tracking-widest px-2">
          <span>Menunjukkan {filteredRecords.length} Laporan Baru</span>
          <button 
            onClick={() => setSelectedIds(new Set(filteredRecords.map(r => r.id)))}
            className="text-yellow-600 dark:text-yellow-500 hover:underline"
          >
            Pilih Semua
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <div key={record.id} className="relative group">
              <div 
                className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-full transition-all ${selectedIds.has(record.id) ? 'bg-yellow-400' : 'bg-transparent'}`}
              />
              <RecordCard 
                record={record} 
                isSelected={selectedIds.has(record.id)}
                onSelect={() => toggleSelect(record.id)}
                onDelete={onDelete} 
                onPreview={() => openPreview(record)}
              />
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-zinc-900 p-16 rounded-3xl text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <Calendar className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-black uppercase">Tiada Rekod Dijumpai</h3>
            <p className="text-sm text-zinc-500 font-medium">Rekod akan dipaparkan secara automatik di sini.</p>
          </div>
        )}
      </div>

      {/* Modal Preview Updated */}
      {isPreviewOpen && previewRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-zinc-800">
            <div className="p-6 bg-zinc-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Review Laporan Rasmi</h3>
                <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">{previewRecord.date} • {previewRecord.time}</p>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-50 dark:bg-zinc-900/30">
              <div className="text-center space-y-1 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <h4 className="font-black text-xl uppercase tracking-tighter">SK KG KLID/PLAJAU</h4>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Program Gilap Permata</p>
              </div>

              {/* Subject & Teacher Info */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Subjek</p>
                  <p className="font-bold flex items-center gap-2">
                    {SUBJECT_EMOJIS[previewRecord.subject]} {previewRecord.subject}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Guru</p>
                  <p className="font-bold uppercase">{previewRecord.teacher}</p>
                </div>
              </div>

              {/* Teaching Material Links */}
              {previewRecord.teachingMaterialLinks && previewRecord.teachingMaterialLinks.length > 0 && (
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-yellow-600 dark:text-yellow-400 uppercase mb-2 flex items-center gap-1">
                    <LinkIcon size={12} /> Pautan Bahan Mengajar
                  </p>
                  <div className="space-y-2">
                    {previewRecord.teachingMaterialLinks.map((link, i) => (
                      <a 
                        key={i}
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:underline break-all bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700"
                      >
                        {i + 1}. {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendance Table */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-900 text-white text-[10px] uppercase font-black tracking-widest">
                    <tr>
                      <th className="px-4 py-3">Nama Murid</th>
                      <th className="px-4 py-3 text-center">Thn</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {ALL_PUPILS.map(p => (
                      <tr key={p.id} className="text-xs">
                        <td className="px-4 py-2.5 font-bold uppercase truncate max-w-[150px]">{p.name}</td>
                        <td className="px-4 py-2.5 text-center font-bold text-zinc-400">T{p.year}</td>
                        <td className={`px-4 py-2.5 text-right font-black ${previewRecord.attendance[p.id] ? 'text-green-500' : 'text-red-500/50'}`}>
                          {previewRecord.attendance[p.id] ? 'HADIR' : 'TIDAK'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-zinc-400">Penyemak (PK Pentadbiran)</p>
                  <div className="h-0.5 w-32 bg-zinc-200 dark:bg-zinc-800"></div>
                  <p className="text-[11px] font-black uppercase leading-tight">{OFFICIALS.COORDINATOR}</p>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-zinc-400">Guru Besar</p>
                  <div className="h-0.5 w-32 bg-zinc-200 dark:bg-zinc-800"></div>
                  <p className="text-[11px] font-black uppercase leading-tight">{OFFICIALS.HEADMASTER}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex gap-4">
              <button 
                onClick={() => { generateAttendancePDF([previewRecord], previewRecord.date); setIsPreviewOpen(false); }}
                className="flex-1 bg-yellow-400 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all shadow-lg active:scale-95"
              >
                <Download size={20} /> MUAT TURUN PDF RASMI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface RecordCardProps {
  record: AttendanceRecord;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  onPreview: () => void;
}

const RecordCard: React.FC<RecordCardProps> = ({ record, isSelected, onSelect, onDelete, onPreview }) => {
  const presentCount = Object.values(record.attendance).filter(v => v).length;
  const hasLinks = record.teachingMaterialLinks && record.teachingMaterialLinks.length > 0;

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-3xl border transition-all duration-300 ${isSelected ? 'border-yellow-400 shadow-xl dark:shadow-yellow-400/5 translate-x-1' : 'border-zinc-200 dark:border-zinc-800 shadow-sm'}`}>
      <div className="p-5 flex flex-wrap items-center gap-4">
        <div 
          onClick={onSelect}
          className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all cursor-pointer ${isSelected ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-zinc-200 dark:border-zinc-700 hover:border-yellow-400'}`}
        >
          {isSelected && <CheckCircle size={14} strokeWidth={4} />}
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-2xl relative">
          <span className="text-2xl">{SUBJECT_EMOJIS[record.subject] || '📚'}</span>
          {hasLinks && (
            <div className="absolute -top-1 -right-1 flex items-center justify-center bg-blue-500 text-[8px] text-white font-black w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm">
              {record.teachingMaterialLinks.length}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <h4 className="font-black text-lg uppercase tracking-tight">{record.subject}</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Clock size={12} className="text-yellow-500" /> {record.date} • {record.time}</span>
            <span className="flex items-center gap-1"><User size={12} className="text-yellow-500" /> {record.teacher}</span>
          </div>
        </div>

        <div className="text-right hidden sm:block mr-4">
          <div className="text-xl font-black">{presentCount} <span className="text-xs text-zinc-400 font-bold uppercase">Hadir</span></div>
          <div className="w-24 bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-1 overflow-hidden">
            <div 
              className="bg-green-500 h-full transition-all" 
              style={{ width: `${(presentCount / ALL_PUPILS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onPreview}
            className="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-yellow-400 rounded-2xl transition-all"
            title="Preview Laporan"
          >
            <Eye size={20} />
          </button>
          <button 
            onClick={() => onDelete(record.id)}
            className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
            title="Padam"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
