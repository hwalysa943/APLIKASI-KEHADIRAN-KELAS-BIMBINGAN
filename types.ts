
export interface Pupil {
  id: string;
  name: string;
  year: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  subject: string;
  teacher: string;
  timestamp: string;
  attendance: { [studentId: string]: boolean };
  teachingMaterialLinks: string[];
}

export interface AppState {
  records: AttendanceRecord[];
  darkMode: boolean;
}

export enum Subject {
  BM = "Bahasa Melayu",
  SC = "Sains",
  BI = "Bahasa Inggeris",
  SEJ = "Sejarah",
  MT = "Matematik"
}

export const SUBJECT_EMOJIS: Record<string, string> = {
  [Subject.BM]: "📖",
  [Subject.SC]: "🔬",
  [Subject.BI]: "🔤",
  [Subject.SEJ]: "📜",
  [Subject.MT]: "🧮"
};

export const TIME_SLOTS = [
  { id: "1", label: "0230-0330 pm", emoji: "☀️" },
  { id: "2", label: "0700-0800 pm", emoji: "🌙" },
  { id: "3", label: "0800-0900 pm", emoji: "🌌" },
  { id: "4", label: "0830-0930 pm", emoji: "✨" }
];
