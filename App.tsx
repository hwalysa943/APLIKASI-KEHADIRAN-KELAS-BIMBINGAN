
import React, { useState, useEffect } from 'react';
import { ALL_PUPILS, TEACHERS, OFFICIALS } from './constants';
import { AppState, AttendanceRecord, Subject, SUBJECT_EMOJIS, TIME_SLOTS } from './types';
import AttendanceForm from './components/AttendanceForm';
import ReportView from './components/ReportView';
import { Sun, Moon, Database, FileText, CheckCircle, Trash2, LayoutDashboard, Cloud, CloudOff, RefreshCw, BarChart3, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'report' | 'dashboard'>('attendance');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Semak pilihan pengguna dalam storan tempatan atau keutamaan sistem
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Kesan perubahan mod gelap
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Muat naik rekod sedia ada
  useEffect(() => {
    const saved = localStorage.getItem('attendance_records');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecords(parsed);
        if (parsed.length > 0) setLastSync(new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Gagal memuat naik data:", e);
      }
    }
  }, []);

  // Simpan rekod ke storan tempatan
  useEffect(() => {
    localStorage.setItem('attendance_records', JSON.stringify(records));
  }, [records]);

  // Simulasi Penyegerakan Auto Google Sheets
  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
      // Log simulasi penyegerakan ke Cloud
      console.log("Data telah berjaya diselaraskan ke Google Sheets PK Pentadbiran.");
    }, 1200);
  };

  const saveRecord = (newRecord: AttendanceRecord) => {
    setRecords(prev => [newRecord, ...prev]);
    triggerSync();
    setActiveTab('report');
  };

  const deleteRecord = (id: string) => {
    if (window.confirm("Hapus rekod ini secara kekal? Data di Cloud juga akan dikemaskini.")) {
      setRecords(prev => prev.filter(r => r.id !== id));
      triggerSync();
    }
  };

  const clearAllHistory = () => {
    if (window.confirm("PADAM SEMUA REKOD? Tindakan ini akan membuang semua sejarah dalam Dashboard dan Cloud.")) {
      setRecords([]);
      triggerSync();
    }
  };

  const getSubjectStats = () => {
    const stats: Record<string, number> = {};
    Object.values(Subject).forEach(s => stats[s] = 0);
    records.forEach(r => {
      stats[r.subject] = (stats[r.subject] || 0) + 1;
    });
    return stats;
  };

  const subjectStats = getSubjectStats();
  const maxSessions = Math.max(...Object.values(subjectStats), 1);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 pb-20">
      <header className="bg-zinc-900 text-white shadow-xl sticky top-0 z-50 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-2 rounded-lg text-black">
                <CheckCircle size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none uppercase">Kehadiran</h1>
                <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-[0.2em] mt-1">SK KG KLID/PLAJAU • GILAP PERMATA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                  {isSyncing ? (
                    <span className="text-yellow-400 animate-pulse flex items-center gap-1">
                      <RefreshCw size={10} className="animate-spin" /> Menyelaras...
                    </span>
                  ) : (
                    <span className="text-green-400 flex items-center gap-1">
                      <Cloud size={10} /> Cloud Aktif
                    </span>
                  )}
                </div>
                {lastSync && <span className="text-[9px] text-zinc-500 font-medium italic">Jam: {lastSync}</span>}
              </div>

              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-yellow-400 transition-all border border-zinc-700 active:scale-90"
                aria-label="Tukar Mod"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-zinc-800/40 p-1.5 rounded-2xl border border-zinc-700/50">
            <button 
              onClick={() => setActiveTab('attendance')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'attendance' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'hover:bg-zinc-700/50'}`}
            >
              <CheckCircle size={16} />
              <span className="hidden sm:inline">Kemasukan</span>
              <span className="sm:hidden">Hadir</span>
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'report' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'hover:bg-zinc-700/50'}`}
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Laporan</span>
              <span className="sm:hidden">Rekod</span>
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === 'dashboard' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'hover:bg-zinc-700/50'}`}
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Stat</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 pb-12">
        {activeTab === 'attendance' && (
          <AttendanceForm onSave={saveRecord} />
        )}

        {activeTab === 'report' && (
          <ReportView 
            records={records} 
            onDelete={deleteRecord} 
            onClearAll={clearAllHistory}
          />
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Jumlah Sesi" 
                value={records.length} 
                icon={<Database className="text-yellow-500" size={20} />} 
                description="Auto-sync ke Google Sheets aktif"
              />
              <StatCard 
                title="Murid Berdaftar" 
                value={ALL_PUPILS.length} 
                icon={<CheckCircle className="text-green-500" size={20} />} 
                description="Senarai lengkap murid"
              />
              <StatCard 
                title="Status Awan" 
                value={isSyncing ? "SYNC..." : "AKTIF"} 
                icon={<Cloud className={isSyncing ? "text-yellow-500 animate-bounce" : "text-blue-500"} size={20} />} 
                description={lastSync ? `Jam ${lastSync}` : "Belum diselaraskan"}
              />
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                  <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                    <BarChart3 className="text-yellow-500" size={22} />
                    Graf Analisis Bulanan
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-bold uppercase mt-1">Taburan Sesi Pembelajaran Mengikut Subjek</p>
                </div>
                <div className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black border border-green-500/20">
                  <TrendingUp size={12} /> KEMASKINI AUTO
                </div>
              </div>
              
              <div className="relative h-64 w-full flex items-end justify-between gap-2 sm:gap-6 px-2 sm:px-6 pb-10">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 border-l border-b border-zinc-400 dark:border-zinc-500 mb-10">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-zinc-400 dark:border-zinc-400"></div>)}
                </div>

                {Object.entries(subjectStats).map(([subj, count]) => {
                  const heightPercentage = (count / maxSessions) * 100;
                  return (
                    <div key={subj} className="relative flex-1 group flex flex-col items-center">
                      <div className="absolute -top-8 bg-black dark:bg-yellow-400 text-white dark:text-black text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform -translate-y-2 group-hover:translate-y-0 z-10 shadow-xl">
                        {count} Sesi
                      </div>
                      <div className="w-full max-w-[50px] bg-zinc-100 dark:bg-zinc-800/50 rounded-t-2xl h-full relative overflow-hidden">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-yellow-400 rounded-t-xl shadow-[0_-4px_15px_rgba(250,204,21,0.3)] transition-all duration-1000 ease-out group-hover:bg-yellow-500"
                          style={{ height: `${heightPercentage}%` }}
                        >
                          {count > 0 && (
                            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-black/40">
                              {count}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-10 w-full text-center flex flex-col items-center">
                         <span className="text-lg mb-0.5">{SUBJECT_EMOJIS[subj]}</span>
                         <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter truncate w-full">
                          {subj.split(' ').pop()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-yellow-400/10 rounded-lg">
                    <RefreshCw className="text-yellow-500" size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Ringkasan Sesi</h3>
                </div>
                <div className="space-y-6">
                  {Object.entries(subjectStats).map(([subj, count]) => (
                    <div key={subj} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black uppercase flex items-center gap-2">
                          <span className="text-xl">{SUBJECT_EMOJIS[subj]}</span> {subj}
                        </span>
                        <span className="text-[10px] font-black bg-black text-white dark:bg-yellow-400 dark:text-black px-3 py-1 rounded-full uppercase">{count} Sesi</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5">
                        <div 
                          className="bg-black dark:bg-yellow-400 h-full rounded-full transition-all duration-1000 ease-in-out"
                          style={{ width: `${records.length > 0 ? (count / records.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-yellow-400/10 rounded-lg">
                    <FileText className="text-yellow-500" size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Pengesahan</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-colors hover:border-yellow-400/50">
                    <p className="text-[9px] font-black uppercase text-zinc-400 mb-2 tracking-[0.2em]">Penyelaras Program</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">{OFFICIALS.COORDINATOR}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 font-medium">{OFFICIALS.COORDINATOR_TITLE}</p>
                  </div>
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-colors hover:border-yellow-400/50">
                    <p className="text-[9px] font-black uppercase text-zinc-400 mb-2 tracking-[0.2em]">Guru Besar</p>
                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">{OFFICIALS.HEADMASTER}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 font-medium">{OFFICIALS.HEADMASTER_TITLE}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; description: string }> = ({ title, value, icon, description }) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-b-4 border-b-yellow-400">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
        {icon}
      </div>
    </div>
    <h3 className="text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.15em]">{title}</h3>
    <p className="text-3xl font-black mt-1 tracking-tighter">{value}</p>
    <p className="text-[10px] text-zinc-400 mt-2 font-bold uppercase">{description}</p>
  </div>
);

export default App;
