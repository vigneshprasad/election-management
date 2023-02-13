import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [
		sveltekit(),
		SvelteKitPWA()
	],
	resolve: {
		alias: {
			".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
		}
	}
};

export default config;
