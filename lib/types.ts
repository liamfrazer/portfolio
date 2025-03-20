import { LucideIcon } from "lucide-react";

export interface WakaTimeActivityCategory {
	name: string; // Category name
	total: number; // Total time spent in Category
}

export interface WakaTimeActivityDay {
	date: string; // Date of entry
	total: number; // Total time for the day
	categories: WakaTimeActivityCategory[]; // Array of Categories
}

export interface WakaTimeActivityResponse {
	days: WakaTimeActivityDay[];
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

export interface WakaTimeActivityChartProps {
	wakaActivityData: WakaTimeActivityResponse | null;
	loading: boolean;
}

export interface WakaTimeLanguage {
	name: string;
	percent: number;
	color: string;
	decimal: string;
	digital: string;
	hours: number;
	minutes: number;
	text: string;
	total_seconds: number;
}

export interface WakaTimeLanguagesResponse {
	data: WakaTimeLanguage[];
}

export interface WakaTimeLanguagesChartProps {
	wakaLanguagesData: WakaTimeLanguagesResponse | null;
	loading: boolean;
}

export interface WakaTimeResponse {
	status: string;
	lastFetchTime: string;
	nextRefreshTime: number;
}

export interface StatsCardProps {
	title: string;
	count: number;
	icon: React.ReactElement<LucideIcon>;
}
