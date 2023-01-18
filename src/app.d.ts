// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: {
			sub: string
    		nickname: string
    		name: string
    		picture: string
    		updated_at: string
		}
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
