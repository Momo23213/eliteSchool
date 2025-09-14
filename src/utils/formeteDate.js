// 📂 utils/dateUtils.ts

export function formatDate(dateInput: string | Date): string {
  const date: Date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const day: string = String(date.getDate()).padStart(2, '0');
  const month: string = String(date.getMonth() + 1).padStart(2, '0'); // +1 car janvier = 0
  const year: number = date.getFullYear();

  return `${day}/${month}/${year}`;
}
