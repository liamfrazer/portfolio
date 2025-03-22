"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { WakaTimeLanguagesChartProps } from "@/lib/types";

const WakaTimeLanguagesChart = ({ wakaLanguagesData, loading }: WakaTimeLanguagesChartProps) => {
	const chartConfig = {
		hours: {
			label: "Hours",
			color: "#ccc",
		},
		percentage: {
			label: "%",
			color: "#ccc",
		},
	} satisfies ChartConfig;

	const chartData = useMemo(
		() =>
			loading
				? []
				: wakaLanguagesData?.data
						.filter((lang) => lang.total_seconds > 36000)
						.map((lang) => ({
							name: lang.name,
							hours: Math.round(lang.total_seconds / 3600),
							fill: lang.color,
							percent: lang.percent,
						})) ?? [],
		[loading, wakaLanguagesData]
	);
	return (
		<Card className="border-none h-full rounded-none">
			<CardHeader>
				<CardTitle>Languages</CardTitle>
				<CardDescription>Hours spent on different languages</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[200px]">
					<BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 5, right: 1 }}>
						<CartesianGrid horizontal={false} />
						<YAxis dataKey="name" type="category" tickLine={false} tickMargin={1} />
						<XAxis dataKey="hours" type="number" hide />
						<ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
						<Bar dataKey="hours" layout="vertical" radius={4}>
							<LabelList dataKey="hours" position="right" offset={8} className="fill-foreground" fontSize={12} />
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default WakaTimeLanguagesChart;
