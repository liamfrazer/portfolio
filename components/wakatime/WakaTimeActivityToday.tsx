"use client";

import { WakaTimeActivityChartProps } from "@/lib/types";
import { formatTime } from "@/lib/utils";

const WakaTimeActivityToday = ({ wakaActivityData, loading }: WakaTimeActivityChartProps) => {
	const today = new Date().toISOString().split("T")[0];

	const totalSeconds = loading ? 0 : wakaActivityData?.days.filter((day) => day.date === today).reduce((sum, day) => sum + day.total, 0) ?? 0;

	const totalHours = formatTime(totalSeconds / 3600);

	return (
		<div className="p-4">
			<div className="flex flex-col gap-1 items-center justify-center">
				<span className="text-sx text-muted-foreground">Activity Today</span>
				<span className="text-lg font-bold leading-none sm:text-3xl">{totalHours}</span>
			</div>
		</div>
	);
};

export default WakaTimeActivityToday;
