"use client";
import { useEffect, useState, useRef } from "react";
import { WakaTimeResponse } from "@/lib/types";
import { CircleCheckBig, AlertCircle, Clock } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WakaTimeCard = () => {
	const [wakaData, setWakaData] = useState<WakaTimeResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [countdown, setCountdown] = useState<number | null>(null);

	// Use refs to keep track of refresh state
	const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const isRefreshingRef = useRef<boolean>(false);

	const clearAllTimers = () => {
		if (refreshTimeoutRef.current) {
			clearTimeout(refreshTimeoutRef.current);
			refreshTimeoutRef.current = null;
		}
		if (countdownIntervalRef.current) {
			clearInterval(countdownIntervalRef.current);
			countdownIntervalRef.current = null;
		}
	};

	// Function to fetch data from the API with improved error handling
	const fetchData = async (isRefresh = false) => {
		if (isRefreshingRef.current) return; // Prevent concurrent fetches

		isRefreshingRef.current = true;
		setLoading(true);
		setError(null);

		try {
			// Add timestamp to prevent caching issues
			const timestamp = Date.now();
			const res = await fetch(`/api/wakatime?t=${timestamp}`, {
				cache: "no-store",
				headers: {
					"Cache-Control": "no-cache, no-store, must-revalidate",
					Pragma: "no-cache",
					Expires: "0",
				},
			});

			if (!res.ok) {
				throw new Error(`HTTP error! Status: ${res.status}`);
			}

			const data = await res.json();

			// Validate the data structure
			if (!data || typeof data !== "object") {
				throw new Error("Invalid data format received");
			}

			console.log("WakaTime API Response:", data);

			// Update state with new data
			setWakaData(data);

			// Calculate and set countdown for next refresh
			if (data.nextRefreshTime && typeof data.nextRefreshTime === "number") {
				const timeLeft = Math.max(0, data.nextRefreshTime - Date.now());
				setCountdown(timeLeft);

				// Set up the next refresh
				clearAllTimers();

				if (timeLeft > 0) {
					refreshTimeoutRef.current = setTimeout(() => {
						fetchData(true);
					}, timeLeft);

					// Start countdown timer
					startCountdown(timeLeft);
				}
			} else {
				console.warn("Missing or invalid nextRefreshTime:", data.nextRefreshTime);
				setCountdown(null);
			}
		} catch (error) {
			console.error("Error fetching WakaTime data:", error);
			setError(error instanceof Error ? error.message : "Unknown error");

			// Retry after 30 seconds on error
			clearAllTimers();
			refreshTimeoutRef.current = setTimeout(() => {
				fetchData(true);
			}, 30000);

			setCountdown(30000);
			startCountdown(30000);
		} finally {
			setLoading(false);
			isRefreshingRef.current = false;
		}
	};

	// Start countdown timer
	const startCountdown = (initialTime: number) => {
		// Clear any existing interval
		if (countdownIntervalRef.current) {
			clearInterval(countdownIntervalRef.current);
		}

		countdownIntervalRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev === null || prev <= 1000) {
					if (countdownIntervalRef.current) {
						clearInterval(countdownIntervalRef.current);
						countdownIntervalRef.current = null;
					}
					return 0;
				}
				return prev - 1000;
			});
		}, 1000);
	};

	// Initial fetch on mount
	useEffect(() => {
		fetchData();

		// Cleanup all timers on unmount
		return () => {
			clearAllTimers();
		};
	}, []);

	// Format the time remaining
	const formatTimeRemaining = (ms: number) => {
		if (ms === null || ms === undefined) return "N/A";
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}m ${seconds}s`;
	};

	return (
		<div className="space-y-4">
			<Card className="w-full">
				<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
					<div className="flex flex-1 flex-col justify-center cap-1 px-6 py-5 sm:py-6">
						<CardTitle>WakaTime Stats</CardTitle>
						<CardDescription className="min-h-6">
							Personal time spent coding since {loading ? <Skeleton className="h-4 w-64 inline-block" /> : error ? <span className="text-red-500">Error loading data</span> : `${wakaData?.human_readable_range || "N/A"}`}
						</CardDescription>
					</div>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-2 text-sm p-4">
					<div className="flex items-center gap-1 justify-between leading-none text-muted-foreground min-h-6">
						<span className="flex items-center gap-1">API Status:</span>
						<span className="flex items-center">
							{loading ? (
								<Skeleton className="h-4 w-16" />
							) : error ? (
								<span className="text-red-500 flex items-center">
									<AlertCircle className="w-4 h-4 mr-1" /> Error
								</span>
							) : (
								<span className={wakaData?.status === "ok" ? "text-green-500" : wakaData?.status === "stale" ? "text-yellow-500" : "text-red-500"}>
									<CircleCheckBig className="w-4 h-4 mr-1" />
								</span>
							)}
						</span>
					</div>
					<div className="flex gap-1 items-center justify-between leading-none text-muted-foreground min-h-6">
						<span className="flex items-center gap-1">Next Refresh:</span>
						<span className="flex items-center">{loading ? <Skeleton className="h-4 w-20" /> : <span className="flex items-center">{formatTimeRemaining(countdown || 0)}</span>}</span>
					</div>
					<div className="flex gap-1 items-center justify-between leading-none text-muted-foreground min-h-6">
						<span>Last Update:</span>
						<span>{loading ? <Skeleton className="h-4 w-32" /> : error ? "Failed to update" : wakaData?.lastFetchTime ? new Date(wakaData.lastFetchTime).toLocaleString() : "N/A"}</span>
					</div>
					{error && <div className="text-xs text-red-500 w-full mt-2 p-2 bg-red-50 rounded">Error: {error}</div>}
				</CardFooter>
			</Card>
		</div>
	);
};

export default WakaTimeCard;
