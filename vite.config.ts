import { sveltekit } from '@sveltejs/kit/vite';

import type { UserConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'


const config: UserConfig = {
	plugins: [
		sveltekit(),
		SvelteKitPWA(
			{ 
				registerType: 'autoUpdate', 
				devOptions: { enabled: true },
				manifest: {
					icons: [ 
						{
							src: 'icon-192x192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: 'icon-512x512.png',
							sizes: '512x512',
							type: 'image/png'
						}
					]
				}
			}
		),
	],
	resolve: {
		alias: {
			".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
		}
	}
};

export default config;
