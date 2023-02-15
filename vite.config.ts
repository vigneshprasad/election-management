import { sveltekit } from '@sveltejs/kit/vite';

import type { UserConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'


const config: UserConfig = {
	plugins: [
		sveltekit(),
		SvelteKitPWA({ registerType: 'autoUpdate', devOptions: { enabled: true }}),
	],
	resolve: {
		alias: {
			".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
		}
	}
};

export default config;
