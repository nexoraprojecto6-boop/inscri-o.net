// Utilitários partilhados (servidor e cliente).

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso));
}

const SESSION_KEY = 'serios_sid';
const PARTICIPANT_KEY = 'serios_pid';

function randomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

/** Identificador de sessão anónimo (apenas no navegador) para distinguir cliques únicos. */
export function getSessionId(): string {
  try {
    let sid = window.localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = randomId();
      window.localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return randomId();
  }
}

export function getParticipantId(): string | null {
  try {
    return window.localStorage.getItem(PARTICIPANT_KEY);
  } catch {
    return null;
  }
}

export function saveParticipantId(id: string) {
  try {
    window.localStorage.setItem(PARTICIPANT_KEY, id);
  } catch {
    /* ignorar */
  }
}
