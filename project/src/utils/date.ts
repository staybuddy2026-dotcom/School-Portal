/**
 * Centralized Date & Time Formatters for Sadvidhya International School ERP
 *
 * Rules:
 * 1. Date Only: DD/MM/YYYY (e.g. 25/07/2003)
 * 2. Date & Time (where strictly necessary, e.g. Gate Pass, Appointments, Infirmary In/Out, Live Telemetry):
 *    DD/MM/YYYY hh:mm:ss A (e.g. 25/07/2003 02:30:45 PM)
 * 3. Never display artificial time where only date is relevant (Activities, Observations, Discipline, Certificates).
 */

export function formatDateOnly(dateStr?: string): string {
  if (!dateStr) return '';
  let day = '01';
  let month = '01';
  let year = '2026';

  const clean = dateStr.trim();
  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        year = parts[0];
        month = parts[1].padStart(2, '0');
        day = parts[2].padStart(2, '0');
      } else {
        day = parts[0].padStart(2, '0');
        month = parts[1].padStart(2, '0');
        year = parts[2];
      }
    }
  } else if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      if (parts[2].length === 4) {
        day = parts[0].padStart(2, '0');
        month = parts[1].padStart(2, '0');
        year = parts[2];
      } else if (parts[0].length === 4) {
        year = parts[0];
        month = parts[1].padStart(2, '0');
        day = parts[2].padStart(2, '0');
      }
    }
  } else {
    return clean;
  }
  return `${day}/${month}/${year}`;
}

export function formatFullDateTime(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return '';
  const dateFormatted = formatDateOnly(dateStr);
  if (!timeStr || !timeStr.trim()) return dateFormatted;

  const t = timeStr.trim();

  // If timeStr is already a duration/range e.g. "09:00 AM - 12:30 PM", keep range
  if (t.includes('-')) {
    return `${dateFormatted} · ${t}`;
  }

  const isPM = /pm/i.test(t);
  const isAM = /am/i.test(t);
  const cleanDigits = t.replace(/[^\d:]/g, '');
  const tParts = cleanDigits.split(':');
  const rawH = parseInt(tParts[0] || '9', 10);
  const m = parseInt(tParts[1] || '0', 10);
  const s = parseInt(tParts[2] || '0', 10);

  let h = rawH;
  let period = 'AM';

  if (isPM) {
    period = 'PM';
    h = rawH === 12 ? 12 : (rawH % 12);
  } else if (isAM) {
    period = 'AM';
    h = rawH === 12 ? 12 : (rawH % 12);
  } else {
    if (rawH === 0) {
      h = 12;
      period = 'AM';
    } else if (rawH === 12) {
      h = 12;
      period = 'PM';
    } else if (rawH > 12) {
      h = rawH - 12;
      period = 'PM';
    } else if (rawH <= 6) {
      h = rawH;
      period = 'PM';
    } else {
      h = rawH;
      period = 'AM';
    }
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dateFormatted} ${pad(h)}:${pad(m)}:${pad(s)} ${period}`;
}
