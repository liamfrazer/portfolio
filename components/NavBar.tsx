"use client";

import ThemeToggler from "@/components/ThemeToggler";

const NavBar = () => {
	return (
		<header>
			<div className="bg-secondary dark:171717 text-white py-2 px-5 flex justify-between">
				<div className="flex items-center">
					<ThemeToggler />
				</div>
			</div>
		</header>
	);
};

export default NavBar;
