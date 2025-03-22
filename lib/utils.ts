import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTime(s: number) {
	if (s == null || s === undefined) return "N/A";
	const hours = Math.floor(s);
	const minutes = Math.floor((s - hours) * 60);
	return `${hours}hrs ${minutes}mins`;
}
