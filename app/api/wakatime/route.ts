import { NextResponse } from "next/server";

const WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE = process.env.WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE || "";
const WAKATIME_EMBEDDABLE_LANGUAGES_ACTIVITY_BAR = process.env.WAKATIME_EMBEDDABLE_LANGUAGES_ACTIVITY_BAR || "";
const WAKATIME_CACHE_DURATION = Number(process.env.WAKATIME_CACHE_DURATION) || 60 * 60 * 1000; // default 1 hour

let cachedData: any = null;
let lastFetchTime = 0;

export async function GET() {
	const now = Date.now();

	if (isNaN(WAKATIME_CACHE_DURATION)) {
		return NextResponse.json({ status: "error", error: "WAKATIME_CACHED_DURATION is not a valid number." });
	}

	// Return cached data if it's still valid
	if (cachedData && now - lastFetchTime < WAKATIME_CACHE_DURATION) {
		return NextResponse.json({ status: "ok", data: cachedData, lastFetchTime, nextRefreshTime: lastFetchTime + WAKATIME_CACHE_DURATION, human_readable_range: cachedData.human_readable_range });
	}

	try {
		const [codingActivityResponse, languagesActivityResponse] = await Promise.all([
			fetch(WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE, {
				cache: "no-store",
				headers: {
					"Cache-Control": "no-cache, no-store, must-revalidate",
					Pragma: "no-cache",
				},
			}),
			fetch(WAKATIME_EMBEDDABLE_LANGUAGES_ACTIVITY_BAR, {
				cache: "no-store",
				headers: {
					"Cache-Control": "no-cache, no-store, must-revalidate",
					Pragma: "no-cache",
				},
			}),
		]);

		if (!codingActivityResponse.ok || !languagesActivityResponse.ok) throw new Error(`Failed to fetch WakaTime data, status: ${codingActivityResponse.status}, ${languagesActivityResponse.status}`);

		const codingActivityData = await codingActivityResponse.json();
		const languagesActivityData = await languagesActivityResponse.json();

		// Update the cache
		cachedData = {
			codingActivityData,
			languagesActivityData,
		};
		lastFetchTime = now;

		console.log("WakaTime API fetched fresh data at:", new Date(now).toISOString());

		return NextResponse.json({ status: "ok", data: cachedData, lastFetchTime, nextRefreshTime: lastFetchTime + WAKATIME_CACHE_DURATION, human_readable_range: cachedData.human_readable_range });
	} catch (error) {
		console.error("WakaTime API error:", error);

		// If we have cached data but it's expired, return it anyway with a warning
		if (cachedData) {
			return NextResponse.json({
				status: "stale",
				data: cachedData,
				lastFetchTime,
				nextRefreshTime: now + 60 * 1000, // Try again in 1 minute
				human_readable_range: cachedData.human_readable_range,
				warning: "Using stale data due to fetch error",
			});
		}

		return NextResponse.json({ status: "error", error: error instanceof Error ? error.message : "Failed to fetch WakaTime data" }, { status: 500 });
	}
}
