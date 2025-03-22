"use client";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import WakaTimeCodingActivityChart from "@/components/wakatime/WakaTimeCodingActivityChart";
import WakaTimeLanguagesChart from "@/components/wakatime/WakaTimeLanguagesChart";
import WakaTimeAPI from "@/components/wakatime/WakaTimeAPI";

import { WakaTimeResponse, WakaTimeActivityResponse, WakaTimeLanguagesResponse } from "@/lib/types";

const WakaTimeCard = () => {
	// Set WakaTime Data States
	const [wakaAPI, setWakaAPI] = useState<WakaTimeResponse | null>(null);
	const [wakaActivityData, setWakaActivityData] = useState<WakaTimeActivityResponse | null>(null);
	const [wakaLanguagesData, setWakaLanguagesData] = useState<WakaTimeLanguagesResponse | null>(null);
	// Set React Component States
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

			toast("WakaTime API updated");

			// Update state with new WakaTime data
			setWakaAPI({
				status: data.status,
				lastFetchTime: data.lastFetchTime,
				nextRefreshTime: data.nextRefreshTime,
			});
			setWakaActivityData(data.data.codingActivityData);
			setWakaLanguagesData(data.data.languagesActivityData);

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

	// TODO: Fix the responsive bugs when the page is reduced to a small size

	return (
		<Card>
			<CardContent>
				<div className="gap-2">
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel defaultSize={70}>
							<WakaTimeCodingActivityChart wakaActivityData={wakaActivityData} loading={loading} />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={30}>
							<ResizablePanelGroup direction="vertical">
								<ResizablePanel defaultSize={15}>
									<WakaTimeAPI loading={loading} error={error} wakaAPI={wakaAPI} countdown={countdown} formatTimeRemaining={formatTimeRemaining} />
								</ResizablePanel>
								<ResizableHandle withHandle />
								<ResizablePanel defaultSize={85}>
									<WakaTimeLanguagesChart wakaLanguagesData={wakaLanguagesData} loading={loading} />
								</ResizablePanel>
							</ResizablePanelGroup>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</CardContent>
		</Card>
	);
};

export default WakaTimeCard;
