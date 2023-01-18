<script lang="ts">
	import { page } from "$app/stores";
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
                applyAction(result);                
            }                        
        );
    }
</script>

<div class="navbar">
    <nav class="container-fluid">
        <ul>
          <li><a href="./" class="contrast"><strong>Election Management</strong></a></li>
        </ul>
        <ul>
            <li class:active={path === '/home'}> 
                <a href="/">
                    <span>Home</span>
                </a>
            </li>
            <li class:active={path === '/voterlist'}> 
                <a href="/voterlist">
                    <span>Voter List</span>
                </a>
            </li>
            <!-- <li>
                <form action="/logout" method="POST" on:submit|preventDefault={handleSubmit}>
                    <button type="submit">
                        Log Out
                    </button>
                </form>
            </li> -->
        </ul>
      </nav>
</div> 