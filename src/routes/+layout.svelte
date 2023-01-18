<script lang="ts">
    import '@picocss/pico/css/pico.min.css'
    import Navigation from '$root/lib/components/navigation.svelte';
    import { page } from '$app/stores'

</script>

{#if $page.data.user}
    <div class="page">
        <Navigation />
        <main class="container">
            <slot />
        </main>
    </div>
{/if}

{#if !$page.data.user}
    <main class="container">
        <slot />
    </main>
{/if}

<style>
    .page {
        height: 100vh;
        margin: 0 auto;
        display: grid;
    }
</style>
