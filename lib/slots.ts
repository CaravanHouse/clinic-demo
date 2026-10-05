// Расписание для демо: свободные окна считаются из id врача и даты, поэтому одинаковы при каждой загрузке.
// В настоящем сайте сюда пришли бы данные из МИС клиники.
import { branchById, doctors, type Doctor } from "@/content/data";

export const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

// Простой детерминированный хеш строки → число 0..1
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export const dateKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

/** Детский филиал не работает по воскресеньям, остальные — без выходных */
export function isDayOff(doctor: Doctor, date: Date) {
  return branchById(doctor.branch).id === "chilanzar" && date.getDay() === 0;
}

/** Свободные слоты врача на дату; для сегодняшнего дня — только будущие */
export function freeSlots(doctor: Doctor, date: Date, now: Date) {
  if (isDayOff(doctor, date)) return [];
  const isToday = dateKey(date) === dateKey(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return TIMES.filter((time) => {
    if (isToday) {
      const [h, m] = time.split(":").map(Number);
      if (h * 60 + m <= nowMinutes + 30) return false;
    }
    // примерно 45% окон заняты — как у популярного врача
    return hash(`${doctor.id}|${dateKey(date)}|${time}`) > 0.45;
  });
}

/** Следующие n дней начиная с сегодня */
export function nextDays(now: Date, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Ближайшее свободное окно врача в пределах двух недель */
export function nextFreeSlot(doctor: Doctor, now: Date) {
  for (const day of nextDays(now, 14)) {
    const slots = freeSlots(doctor, day, now);
    if (slots.length) return { date: day, time: slots[0] };
  }
  return null;
}

/** Самые ранние окна по всей клинике — для карточки в первом экране */
export function earliestSlots(now: Date, count: number) {
  const all = doctors.flatMap((doctor) => {
    const slot = nextFreeSlot(doctor, now);
    return slot ? [{ doctor, ...slot }] : [];
  });
  return all
    .sort((a, b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time))
    .slice(0, count);
}

/** Файл .ics, чтобы пациент добавил запись в календарь телефона */
export function icsFile({ title, location, date, time }: { title: string; location: string; date: Date; time: string }) {
  const [h, m] = time.split(":").map(Number);
  const start = new Date(date);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mehr Medical demo//CaravanHouse//RU",
    "BEGIN:VEVENT",
    `UID:${fmt(start)}-${Math.round(hash(title) * 1e6)}@clinic.caravanhouse.uz`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
