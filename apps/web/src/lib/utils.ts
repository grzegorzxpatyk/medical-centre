import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

/** Payload dates are ISO strings; renders them as 12.09.2024 */
export function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}
