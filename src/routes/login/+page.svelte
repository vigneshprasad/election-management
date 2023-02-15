<script lang="ts">
    import { fly } from 'svelte/transition';
    import { onMount } from "svelte";
    import type { Auth0Client } from "@auth0/auth0-spa-js";
    import auth from "$lib/services/auth";
	import { applyAction, deserialize } from "$app/forms";
	import type { ActionResult } from "@sveltejs/kit";

    let auth0Client:Auth0Client;

    onMount(async () => {
        auth0Client = await auth.createClient();
    });

    const handleSubmit: svelte.JSX.EventHandler<Event, HTMLFormElement> = async (
        event
    ) => { 
        const action = event.currentTarget.action
        await auth.loginWithPopup(auth0Client).then(
            () => {
                try {
                    auth0Client.getTokenSilently().then(
                        async (token) => {
                            var form_data = new FormData();
                            form_data.append('access_token', token);
                            const response = await fetch(action, {
                                method: 'POST',
                                body: form_data
                            });
                            const result: ActionResult = deserialize(await response.text());
                            applyAction(result);
                        }
                    );
                } catch (e:any) {
                    if (e.error === 'login_required') {
                        console.log("HOW DID THIS HAPPEN")
                    }  
                    if (e.error === 'consent_required') {
                        console.log("NOT LOGGED IN")
                    }
                    throw e;
                }

            }
        );
    }

</script>

<svelte:head>
    <title> MTB Rajesh Election</title>
</svelte:head>

<main class="container">
    <h1 class="title">Election Management</h1>
    <p class="text">Manage voter list, checkout dashboards and verify voters</p>
    <form method="POST" on:submit|preventDefault={handleSubmit} action="?/login">
        <button class="btn" type="submit">Log In</button> 
    </form>        
</main>

<style>
    .container {
        height: 100vh;
        display: grid;
        text-align: center;
        place-content: center;
    }
</style>