import { NextResponse } from "next/server";

const WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE = process.env.WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE || "";
const WAKATIME_CACHE_DURATION = Number(process.env.WAKATIME_CACHE_DURATION) || 60 * 60 * 1000; // default 1 hour

let cachedData: any = null;
let lastFetchTime = 0;

export async function GET() {
	const now = Date.now();

	if (isNaN(WAKATIME_CACHE_DURATION)) {
		return NextResponse.json({ error: "WAKATIME_CACHED_DURATION is not a valid number." });
	}

	if (cachedData && now - lastFetchTime < WAKATIME_CACHE_DURATION) {
		return NextResponse.json({ ...cachedData, lastFetchTime, nextRefreshTime: lastFetchTime + WAKATIME_CACHE_DURATION });
	}

	try {
		const res = await fetch(WAKATIME_EMBEDDABLE_CODING_ACTIVITY_TABLE, { cache: "no-store" });
		if (!res.ok) throw new Error("Failed to fetch WakaTime Embeddable Coding Activity Table data");

		cachedData = await res.json();
		lastFetchTime = now;

		return NextResponse.json({ cachedData, lastFetchTime, nextRefreshTime: lastFetchTime + WAKATIME_CACHE_DURATION });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch WakaTime data" }, { status: 500 });
	}
}
