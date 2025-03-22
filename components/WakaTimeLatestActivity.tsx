"use client";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { WakaTimeActivityChartProps } from "@/lib/types";
import { formatTime } from "@/lib/utils";

const WakaTimeLatestActivity = ({ wakaActivityData, loading }: WakaTimeActivityChartProps) => {
	const today = new Date().toISOString().split("T")[0];

	const totalSeconds = loading ? 0 : wakaActivityData?.days.filter((day) => day.date === today).reduce((sum, day) => sum + day.total, 0) ?? 0;

	const totalHours = formatTime(totalSeconds / 3600);

	return (
		<div className="p-4">
			<Card>
				<CardHeader>
					<CardDescription className="text-sx text-muted-foreground">Latest Activity Today</CardDescription>
					<CardTitle className="text-lg font-bold leading-none sm:text-3xl">{totalHours}</CardTitle>
				</CardHeader>
			</Card>
		</div>
	);
};

export default WakaTimeLatestActivity;
