<script lang="ts">
    import '@picocss/pico/css/pico.min.css'
    import Navigation from '$root/lib/components/navigation.svelte';
    import { page } from '$app/stores'
    import { navigating } from '$app/stores'

</script>

{#if $page.data.user}
    <div class="page">
        <!-- <Navigation isAdmin={$page.data.user}/> -->
        <Navigation />
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

<style>
    .page {
        height: 100vh;
        margin: 0 auto;
        display: grid;
    }
</style>
