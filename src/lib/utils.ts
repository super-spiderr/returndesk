import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Standard shadcn-style class merger: clsx for conditionals, tailwind-merge to resolve conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
