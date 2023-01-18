<script lang="ts">
    import type { VoterBasic } from '$root/types';
    import { fade } from 'svelte/transition';
	import { Gender, Relation } from '@prisma/client';
    import type { Part } from '@prisma/client';
	import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import { page } from '$app/stores';

    
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

    function generateRelationString(relationName:string, relationType:Relation, gender:Gender) {
        let relationString:string =  relationName;
        if (relationType === Relation.F || relationType === Relation.M) {
            if(gender == Gender.F) {
                relationString = "Daughter of " + relationName;
            }
            if(gender == Gender.M) {
                relationString = "Son of " + relationName;
            }
        } else if (relationType === Relation.H) {
            relationString = "Wife of " + relationName
        }
        return relationString;
    }
</script>

<svelte:head>
    <title> Voter List </title>
</svelte:head>

<h1> Voter List </h1>

<form action="/" on:submit|preventDefault={handleSubmit}>
    <input id="search" type="search" placeholder="Search" bind:value={search}/>
    <section class="menu-cont">
        <select id="partId" bind:value={selectedPart}>
            <option selected={selectedPart===-1} value={-1}>Select a Part</option>
            {#each parts as part}
                <option selected={part.id===selectedPart} value={part.id}>{part.name}</option>
            {/each}
        </select>
    </section>
    <button type="submit"> SUBMIT </button>
</form>

{#if voters.length == 0}
    <h1> NO VOTERS FOUND</h1>
{/if}
{#each voters as voter (voter.id)}
    <a href={`/voter/${voter.id}`}>
        <div class="voter-row" transition:fade>
            <span class="id"> {voter?.id} </span>
            <span class="name">{voter?.name}</span>
            <span class="gender">{voter?.gender}</span>
            <span class="age">{voter?.age}</span>
            <span class="relation">{voter && generateRelationString(voter.relationName, voter.relationType, voter.gender)}</span>
        </div>
    </a>
{/each}

<style>
    h1 {
        position: sticky;
        top: 0;
        padding: var(--spacing-8) var(--spacing-24);
        font-size: var(--font-24);
        backdrop-filter: blur(100px);
    }
</style>