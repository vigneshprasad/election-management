<script lang="ts">
	import { page } from "$app/stores";
    import Icon from './icon.svelte';
    import { onMount } from "svelte";
    import type { Auth0Client } from "@auth0/auth0-spa-js";
    import auth from "$lib/services/auth";
	import { applyAction, deserialize } from "$app/forms";
	import type { ActionResult } from "@sveltejs/kit";
	import { invalidateAll } from '$app/navigation';

    $: path = $page.url.pathname    

    let auth0Client:Auth0Client;

    onMount(async () => {
        auth0Client = await auth.createClient();
    });

    const handleSubmit: svelte.JSX.EventHandler<Event, HTMLFormElement> = async (
        event
    ) => { 
        const action = event.currentTarget.action
        await auth.logout(auth0Client).then(
            async () => {
                const response = await fetch(action, {
                    method: 'POST',
                    body: new FormData()
                });
                await invalidateAll();
                const result: ActionResult = deserialize(await response.text());
                console.log("RESULT", result)
                applyAction(result);                
            }                        
        );
    }
</script>

<aside>
    <div class="container">
        <nav>
            <ul>
                <li class:active={path === '/home'}> 
                    <a href="/">
                        <Icon width="32" height="32" name="home" />
						<span>Home</span>
                    </a>
                </li>
                <li class:active={path === '/voterlist'}> 
                    <a href="/voterlist">
                        <Icon width="32" height="32" name="home" />
						<span>Voter List</span>
                    </a>
                </li>

                <form action="/logout" method="POST" on:submit|preventDefault={handleSubmit}>
                    <button class="btn logout" type="submit">
                        Log Out
                    </button>
                </form>
            </ul>
        </nav>
    </div> 

</aside>

<style>
    .container {
        position: sticky;
        top: 0;
    }

    ul {
        display: grid;
        gap: var(--spacing-8);
        font-size: var(--font-18);
    }

    li a {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-16);
        padding: 1.4rem;
        border-radius: var(--raadius-base);
        transition: all 0.2 ease;
    }

    li a:hover {
        background-color: var(--color-link-hover);
    }

    li.active {
        font-weight: 700;
    }

    span {
        display: none;
    }

    .logout {
        display: none;
        text-align: center;
    }

    .logout:hover {
        background-color: var(--color-btn-primary-active-hover);
    }

    @media (min-width: 1024px) {
        aside {
            padding: 0 var(--spacing-32);
        }

        span {
            display: block;
        }

        .logout {
            width: 100%;
            display: block;
            margin-top: var(--spacing-16);
        }
    }
</style>