import { Separator } from "@/components/ui/separator";

import WakaTimeCard from "@/components/wakatime/WakaTimeCard";

export default function Home() {
	return (
		<main className="container mx-auto p-6">
			<Separator className="gap-2 mb-2" />
			<section id="coding">
				<WakaTimeCard />
			</section>
		</main>
	);
}
