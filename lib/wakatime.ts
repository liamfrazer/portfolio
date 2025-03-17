import { unstable_cache } from "next/cache";

export interface WakaTimeCategory {
	name: string; // Category name
	total: number; // Total time spent in Category
}

export interface WakaTimeDay {
	date: string; // Date of entry
	total: number; // Total time for the day
	categories: WakaTimeCategory[]; // Array of Categories
}

export interface WakaTimeResponse {
	days: WakaTimeDay[];
	status: string;
	is_up_to_date: boolean;
	is_up_to_date_pending_future: boolean;
	is_stuck: boolean;
	is_already_updating: boolean;
	range: string;
	percent_calculated: number;
	writes_only: boolean;
	user_id: string;
	is_including_today: boolean;
	human_readable_range: string;
}

const WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE = process.env.WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE;

if (!WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE) {
	throw new Error("Missing WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE in environment variables");
}

export const fetchWakaTimeCodingActivityTable = unstable_cache(
	async (): Promise<WakaTimeResponse> => {
		const res = await fetch(WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE, {
			next: { revalidate: 86400 }, // Default cache for 24 hours
		});

		if (!res.ok) {
			throw new Error("Failed to fetch WakaTime Embeddable Coding Activity Table");
		}

		console.log(`WakaTime Embeddable Coding Activity Table Status: ${res.ok}`);

		return res.json();
	},
	["wakatime-coding-activity-table"],
	{ revalidate: 86400 }
);
