"use client";

import { useEffect, useState } from "react";
import { WakaTimeResponse } from "@/lib/types";
import { Circle } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WakaTimeCard = () => {
	const [wakaData, setWakaData] = useState<WakaTimeResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [timeUntilRefresh, setTimeUntilRefresh] = useState<number | null>(null);

	const fetchData = async () => {
		try {
			const res = await fetch("/api/wakatime");
			if (!res.ok) throw new Error("Failed to fetch");

			const data: WakaTimeResponse = await res.json();
			setWakaData(data);

			// Calculate time until next refresh
			if (data.nextRefreshTime) {
				const timeLeft = Math.max(0, data.nextRefreshTime - Date.now());
				setTimeUntilRefresh(timeLeft);
			}
		} catch (error) {
			console.error("Error fetching WakaTime data:", error);
		}

		setLoading(false);
	};

	// Auto-refresh countdown
	useEffect(() => {
		if (timeUntilRefresh === null) return;

		const interval = setInterval(() => {
			setTimeUntilRefresh((prev) => (prev && prev > 1000 ? prev - 1000 : 0));
		}, 1000);

		return () => clearInterval(interval);
	}, [timeUntilRefresh]);

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>WakaTime Stats</CardTitle>
					<CardDescription></CardDescription>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-2 text-sm">
					<div className="flex gap-2 font-medium leading-none">
						API Status: {loading ? <Skeleton className="h-2 w-3" /> : <span className={wakaData?.status === "ok" ? "text-green-500" : "text-red-500"}>{<Circle className="w-4 h-4 mr-2" />}</span>}
					</div>
					<div className="leading-none text-muted-foreground">
						Next Refresh: {loading ? <Skeleton className="h-2 w-3" /> : timeUntilRefresh !== null ? `${Math.floor(timeUntilRefresh / 60000)}m ${Math.floor((timeUntilRefresh % 60000) / 1000)}s` : "N/A"}
					</div>
					<div className="leading-none text-muted-foreground">Last Update: {loading ? <Skeleton className="h-2 w-3" /> : wakaData?.lastFetchTime && <span>{new Date(wakaData.lastFetchTime).toLocaleString() || "N/A"}</span>}</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default WakaTimeCard;

// {/* Last Fetch time from /api/wakatime */}
// Status: {loading ? <Skeleton className="h-4 w-20" /> : <span className={wakaData?.status === "ok" ? "text-green-500" : "text-red-500"}>{wakaData?.status}</span>
// {wakaData?.lastFetchTime && (
// 	<p className="text-sm text-gray-500 text-center">
// 		Last API Fetch: {new Date(wakaData.lastFetchTime).toLocaleString()}
// 		}
// 	</p>
// )}
