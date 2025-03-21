"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { WakaTimeActivityChartProps } from "@/lib/types";

const chartConfig = {
	total: {
		label: "Total",
		color: "#2563EA",
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
		const hours = Math.floor(s / 1);
		const minutes = Math.floor((s % 3600) / 60);
		return `${hours}hrs ${minutes}mins`;
	};

	const chartData = loading
		? []
		: wakaActivityData?.days
				.filter((day) => day.total > 1800)
				.map((day) => ({
					date: day.date,
					total: day.total / 3600,
					hours: formatTime(day.total),
				})) ?? [];

	const totalDays = chartData?.length;
	const totalHours = formatTime(chartData?.reduce((sum, day) => sum + (day.total ?? 0), 0));

	return (
		<Card>
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
					<CardTitle>Coding Activity</CardTitle>
					<CardDescription>Showing total coding activity per day</CardDescription>
				</div>
				<div className="flex">
					<button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
						<span className="text-sx text-muted-foreground">Hours</span>
						<span className="text-lg font-bold leading-none sm:text-3xl">{totalHours}</span>
					</button>
					<button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
						<span className="text-sx text-muted-foreground">Days</span>
						<span className="text-lg font-bold leading-none sm:text-3xl">{totalDays}</span>
					</button>
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
					<BarChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
						<Bar dataKey="total" fill="#2563EA" />
						<ChartTooltip cursor={true} content={<ChartTooltipContent className="w-[150px]" nameKey="hours" />} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default WakaTimeCodingActivityChart;
