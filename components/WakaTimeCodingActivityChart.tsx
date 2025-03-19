"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { WakaTimeActivityChartProps } from "@/lib/types";

const chartConfig = {
	total: {
		label: "Total",
		color: "#ccc",
	},
	date: {
		label: "Date",
		color: "#ccc",
	},
	hours: {
		label: "Hours",
		color: "#ccc",
	},
} satisfies ChartConfig;

const WakaTimeCodingActivityChart = ({ wakaActivityData, loading }: WakaTimeActivityChartProps) => {
	const formatTime = (s: number) => {
		if (s == null || s === undefined) return "N/A";
		const hours = Math.floor(s / 3600);
		const minutes = Math.floor((s % 3600) / 60);
		return `${hours}hr ${minutes}mins`;
	};

	const chartData = loading
		? [{ date: "loading..." }]
		: wakaActivityData?.days
				.filter((day) => day.total > 3600)
				.map((day) => ({
					date: day.date,
					total: day.total / 3600,
					hours: formatTime(day.total),
				}));

	return (
		<>
			<Card>
				<CardContent>
					<ChartContainer config={chartConfig}>
						<LineChart accessibilityLayer data={chartData} margin={{ right: 12 }}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey="date" tickLine={false} axisLine={false} />
							<YAxis axisLine={false} />
							<ChartTooltip cursor={true} content={<ChartTooltipContent nameKey="hours" />} />
							<Line dataKey={"total"} type="monotone" stroke="#8884d8" strokeWidth={2} dot={true} />
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</>
	);
};

export default WakaTimeCodingActivityChart;
