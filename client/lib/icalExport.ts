/**
 * iCal / Google Calendar export utility
 * Generates a .ics file from a trip itinerary that works with
 * Google Calendar, Apple Calendar, Outlook, and any RFC 5545 compatible app.
 */

export interface ICalActivity {
  title: string;
  date: string; // ISO date e.g. "2024-06-15"
  time?: string; // e.g. "09:00"
  duration?: number; // minutes, default 60
  description?: string;
  location?: string;
}

export interface ICalTripOptions {
  tripName: string;
  destination: string;
  activities: ICalActivity[];
  calendarName?: string;
}

function formatDate(dateStr: string, timeStr?: string): string {
  const d = new Date(dateStr);
  if (timeStr) {
    const [hh, mm] = timeStr.split(":").map(Number);
    d.setHours(hh || 0, mm || 0, 0, 0);
  }
  // Format: YYYYMMDDTHHMMSS (local time, no Z for floating time)
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    (timeStr ? `T${pad(d.getHours())}${pad(d.getMinutes())}00` : "")
  );
}

function escapeText(s: string) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}@tripgenius.app`;
}

export function generateICS(opts: ICalTripOptions): string {
  const now = formatDate(new Date().toISOString().split("T")[0]);
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TripGenius//Trip Planner//EN",
    `X-WR-CALNAME:${escapeText(opts.calendarName ?? opts.tripName)}`,
    "X-WR-TIMEZONE:UTC",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const act of opts.activities) {
    const dtStart = formatDate(act.date, act.time);
    const durMs = (act.duration ?? 60) * 60 * 1000;
    const endD = new Date(act.date);
    if (act.time) {
      const [hh, mm] = act.time.split(":").map(Number);
      endD.setHours(hh, mm, 0, 0);
    }
    endD.setTime(endD.getTime() + durMs);
    const dtEnd = formatDate(
      endD.toISOString().split("T")[0],
      `${String(endD.getHours()).padStart(2, "0")}:${String(endD.getMinutes()).padStart(2, "0")}`,
    );

    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid()}`,
      `DTSTAMP:${now}Z`,
      `DTSTART${act.time ? "" : ";VALUE=DATE"}:${dtStart}`,
      `DTEND${act.time ? "" : ";VALUE=DATE"}:${dtEnd}`,
      `SUMMARY:${escapeText(`[${opts.destination}] ${act.title}`)}`,
      ...(act.description
        ? [`DESCRIPTION:${escapeText(act.description)}`]
        : []),
      ...(act.location ? [`LOCATION:${escapeText(act.location)}`] : []),
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(icsContent: string, filename: string) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Builds a Google Calendar quick-add URL for the whole trip period */
export function buildGoogleCalendarURL(opts: {
  title: string;
  startDate: string;
  endDate: string;
  details?: string;
  location?: string;
}): string {
  const fmt = (d: string) => d.replace(/-/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(opts.startDate)}/${fmt(opts.endDate)}`,
    details: opts.details ?? `Trip planned with TripGenius: ${opts.title}`,
    location: opts.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
