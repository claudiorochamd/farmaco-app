export interface SessionRecord {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  scenarioColor: string;
  outcome: 'solved' | 'dead';
  timeUsed: number;     // segundos usados
  attempts: number;     // tentativas nesse cenário
  wrongDrugs: string[]; // fármacos errados tentados
  quizScore: number | null; // 0-3 ou null se não fez o quiz
  timestamp: number;
}

const KEY = 'farmaco_session_history';

export function loadHistory(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: SessionRecord): void {
  const history = loadHistory();
  history.unshift(record); // mais recentes primeiro
  if (history.length > 50) history.splice(50); // máximo 50 registros
  localStorage.setItem(KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(KEY);
}

export function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
