import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID with an optional prefix
 * @param prefix - Optional prefix for the ID (default: 'id')
 * @returns A unique string ID
 */
export function generateUniqueId(prefix = "id"): string {
	const timestamp = Date.now().toString(36);
	const randomPart = Math.random().toString(36).substring(2, 8);
	return `${prefix}-${timestamp}-${randomPart}`;
}
