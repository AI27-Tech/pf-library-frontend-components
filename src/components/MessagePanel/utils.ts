export type Presence = "online" | "offline";

export function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function initials(name?: string) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Convierte una fecha a un timestamp inteligente.
 * Ejemplos: "Today", "Yesterday", "2 days ago", "Mar 15, 2:30 PM"
 */
export function formatSmartTimestamp(date: Date | number | string): string {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  const now = new Date();
  
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  const daysAgo = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  const isThisWeek = daysAgo < 7 && daysAgo >= 0;

  // Formato de hora
  const hour = d.getHours().toString().padStart(2, "0");
  const minute = d.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hour}:${minute}`;

  if (isToday) {
    return `Today ${timeStr}`;
  }
  if (isYesterday) {
    return `Yesterday ${timeStr}`;
  }
  if (isThisWeek) {
    return `${daysAgo} days ago`;
  }

  // Formato: "Mar 15, 2:30 PM"
  const monthDay = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${monthDay}, ${timeStr}`;
}
