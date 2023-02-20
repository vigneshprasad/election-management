<script lang="ts">
    import type { VoterBasic } from '$root/types';
    import { fade } from 'svelte/transition';
	import { Gender, Relation } from '@prisma/client';
    import type { Part } from '@prisma/client';
	import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { generateRelationString } from "$root/lib/services/stringProcessingFunctions";

    
    export let data: PageData;
    let voters:VoterBasic[] = data.voters;
    let parts: Part[] = data.parts;
    $: ({ voters, parts } = data);
    let selectedPart: number;
    let search:string;

    search = $page.url.searchParams.get('search') || ''
    selectedPart = Number($page.url.searchParams.get('partId')) || -1

    const handleSubmit: svelte.JSX.EventHandler<Event, HTMLFormElement> = async (
        event
    ) => {
            let queryParams:any = {}
            const search = (event.target as HTMLFormElement).search.value;
            const partId = (event.target as HTMLFormElement).partId.value;
            if(search !== '') {
                queryParams.search = search
            } 
            if(partId > 0) {
                queryParams.partId = partId
            }
            const searchParams = new URLSearchParams(queryParams);
            await goto(`/voterlist?${searchParams.toString()}`, {
                invalidateAll: true
            });
    }

    function routeToPage(route: string, replaceState: boolean):undefined {
        goto(`/${route}`, { replaceState }) 
        return;
    }
</script>

<svelte:head>
    <title> Voter List </title>
</svelte:head>

<h1> Voter List </h1>
<form action="/" on:submit|preventDefault={handleSubmit}>
    <input id="search" type="search" placeholder="Search" bind:value={search}/>
    <select id="partId" bind:value={selectedPart}>
        <option selected={selectedPart===-1} value={-1}>Select a Part</option>
        {#each parts as part}
            <option selected={part.id===selectedPart} value={part.id}>{part.id} | {part.name}</option>
        {/each}
    </select>
    <button class="submit" type="submit"> Submit </button>
</form>

{#if voters.length == 0}
    <h1> No Voters Found</h1>
{/if}
{#each voters as voter (voter.id)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <article class="card" transition:fade on:click={routeToPage(`voter/${voter.id}`, true)}>
        <h5 class="name">{voter?.name}</h5>
        <span class="gender">{voter?.gender} {voter?.age}</span>
        <p class="relation">{voter && generateRelationString(voter.relationName, voter.relationType, voter.gender)}</p>
    </article>
{/each}

<style>
    .card {
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        padding: 8px 16px;
        margin: 8px;
        display: flex;
        flex-direction: column;
        cursor:pointer;
    }
  
    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }

    h1 {
        margin-bottom: 16px;
        margin-top: 16px
    }

    p, h5 {
        margin: 0
    }
  
</style>