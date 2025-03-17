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
	lastFetchTime: string;
	nextRefreshTime: number;
}
