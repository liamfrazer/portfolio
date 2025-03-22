import { AlertCircle, CircleCheckBig } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { WakaTimeAPIStatusProps } from "@/lib/types";

const WakaTimeAPI = ({ loading, error, wakaAPI, countdown, formatTimeRemaining }: WakaTimeAPIStatusProps) => {
	return (
		<div className="flex items-center justify-center p-4 gap-4">
			{/* API Status */}
			<div className="flex items-center gap-2 text-muted-foreground">
				<span className="font-medium">API Status:</span>
				{loading ? (
					<Skeleton className="h-4 w-16" />
				) : error ? (
					<span className="text-red-500 flex items-center">
						<AlertCircle className="w-4 h-4 mr-1" /> Error
					</span>
				) : (
					<span className={wakaAPI?.status === "ok" ? "text-green-500" : wakaAPI?.status === "stale" ? "text-yellow-500" : "text-red-500"}>
						<CircleCheckBig className="w-4 h-4 mr-1" />
					</span>
				)}
			</div>

			{/* Refresh Timer */}
			<div className="flex items-center gap-2 text-muted-foreground">
				<span className="font-medium">Refresh:</span>
				{loading ? <Skeleton className="h-4 w-20" /> : <span className="flex items-center">{formatTimeRemaining(countdown || 0)}</span>}
			</div>

			{/* Error Message */}
			{error && <div className="text-xs text-red-500 w-full mt-2 p-2 bg-red-50 rounded">Error: {error}</div>}
		</div>
	);
};

export default WakaTimeAPI;
