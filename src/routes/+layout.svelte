<script lang="ts">
    import '../styles/global.css'
    import Navigation from '$root/lib/components/navigation.svelte';
    import { page } from '$app/stores'

</script>

{#if $page.data.user}
    <div class="container">
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
    .container {
        height: 100vh;
        margin: 0 auto;
        display: grid;
        grid-template-columns: auto 1fr;
    }

    .content {
        border-left: 1px solid var(--color-border-primary);
    }

    /* @media (min-width: 1024px) {
        .container {
            max-width: 1240px;
            margin: 0 auto;
            grid-template-columns: 1fr 4fr;
        }
    } */
</style>
