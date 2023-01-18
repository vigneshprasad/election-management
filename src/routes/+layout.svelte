<script lang="ts">
    import '@picocss/pico/css/pico.min.css'
    import Navigation from '$root/lib/components/navigation.svelte';
    import { page } from '$app/stores'

</script>

{#if $page.data.user}
    <div class="page">
        <Navigation />
        <main class="content">
            <slot />
        </main>
    </div>
{/if}

{#if !$page.data.user}
    <main class="content">
        <slot />
    </main>
{/if}

<style>
    .page {
        height: 100vh;
        margin: 0 auto;
        display: grid;
    }

    /* @media (min-width: 1024px) {
        .container {
            max-width: 1240px;
            margin: 0 auto;
            grid-template-columns: 1fr 4fr;
        }
    } */
</style>
