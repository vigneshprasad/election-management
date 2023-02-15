<script lang="ts">
    import '@picocss/pico/css/pico.min.css';
    import Navigation from '$root/lib/components/navigation.svelte';
    import { page } from '$app/stores';
    import { navigating } from '$app/stores';

    import { onMount } from 'svelte'
    import { pwaInfo } from 'virtual:pwa-info'
    
    onMount(async () => {
    if (pwaInfo) {
        const { registerSW } = await import('virtual:pwa-register')
        registerSW({
            immediate: true,
            onRegistered(r: { update: () => void; }) {
            r && setInterval(() => {
               console.log('Checking for sw update')
               r.update()
            }, 2000 )
            console.log(`SW Registered: ${r}`)
            },
            onRegisterError(error: any) {
            console.log('SW registration error', error)
            }
        })
        }
    })
    $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '' 
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>

<main>
    {#if $page.data.user}
        <div class="page">
            <Navigation isAdmin={$page.data.user}/>
            {#if $navigating} 
                <div class="loading" aria-busy="true" />
            {:else}
                <main class="container">
                    <slot />
                </main>
            {/if}
        </div>
    {/if}

    {#if !$page.data.user}
        {#if $navigating} 
            <div class="loading" aria-busy="true" />
        {:else}
            <main class="container" aria-busy={$navigating ? "true" : "false"}>
                <slot />
            </main>
        {/if} 
    {/if}
</main>

<style>
    .page {
        height: 100vh;
        margin: 0 auto;
        display: grid;
    }
</style>
