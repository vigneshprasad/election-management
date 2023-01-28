<script lang="ts">
    import { Education, Religion, type Part } from '@prisma/client';
	import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import Chart from 'svelte-frappe-charts';

    export let data: PageData;
    let parts: Part[] = data.parts;
    type ReligionPie = { [K in Religion]: { bjp:number, congress: number, fence:number}; }
    type EducationPie = { [K in Education]: { bjp:number, congress: number, fence:number}; }
    let religionPie: ReligionPie = data.religionPie;
    let educationPie: EducationPie = data.educationPie;
    let selectedPart: number;

    selectedPart = Number($page.url.searchParams.get('partId')) || -1

    const handleSubmit: svelte.JSX.EventHandler<Event, HTMLFormElement> = async (
        event
    ) => {
            let queryParams:any = {}
            const partId = (event.target as HTMLFormElement).partId.value;
            if(partId > 0) {
                queryParams.partId = partId
            }
            const searchParams = new URLSearchParams(queryParams);
            await goto(`/voterlist?${searchParams.toString()}`, {
                invalidateAll: true
            });
    }
</script>
  

<svelte:head>
    <title> Data Dashboard </title>
</svelte:head>

<h1> Data Dashboard </h1>
<form action="/" on:submit|preventDefault={handleSubmit}>
    <select id="partId" bind:value={selectedPart}>
        <option selected={selectedPart===-1} value={-1}>Select a Part</option>
        {#each parts as part}
            <option selected={part.id===selectedPart} value={part.id}>{part.name}</option>
        {/each}
    </select>
    <button class="submit" type="submit"> Submit </button>
</form>

<h1> Religion Breakdown </h1>
<div class=pie-charts>
    {#each Object.values(Religion) as religionOption}
        <div class="chart-container">
            <h5> {religionOption} </h5>
            <Chart 
                colors={['#f97d09', '#138808', '#fff']}
                data={{
                    labels: ['BJP', 'Congress', 'On the Fence'],
                    datasets: [
                        {
                            values: [
                                religionPie[religionOption].bjp, 
                                religionPie[religionOption].congress, 
                                religionPie[religionOption].fence
                            ],
                        }
                    ]
                }} type="pie" />
        </div>
    {/each}
</div>

<h1> Education Breakdown </h1>
<div class=pie-charts>
    {#each Object.values(Education) as educationOption}
        <div class="chart-container">
            <h5> {educationOption} </h5>
            <Chart 
                colors={['#f97d09', '#138808', '#fff']}
                data={{
                    labels: ['BJP', 'Congress', 'On the Fence'],
                    datasets: [
                        {
                            values: [
                                educationPie[educationOption].bjp, 
                                educationPie[educationOption].congress, 
                                educationPie[educationOption].fence
                            ],
                        }
                    ]
                }} type="pie" />
        </div>
    {/each}
</div>


<style>
    h1 {
        margin-bottom: 16px;
        margin-top: 16px
    }

    .pie-charts {
        max-width: 100%;
        display: grid;
        grid-template-columns: 0.5fr 0.5fr;
    }
    /* p, h5 {
        margin: 0
    } */
</style>

