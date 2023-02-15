import { sveltekit } from '@sveltejs/kit/vite';
// import { SvelteKitPWA } from '@vite-pwa/sveltekit';

import type { UserConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const config: UserConfig = {
	plugins: [
		sveltekit(),
		VitePWA({ registerType: 'autoUpdate', devOptions: { enabled: true }}),
	],
	resolve: {
		alias: {
			".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
		}
	}
};

export default config;
