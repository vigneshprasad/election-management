<script lang="ts">
    import { Education, Religion, type Part, type Voter } from '@prisma/client';
	import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import Chart from 'svelte-frappe-charts';
    import { CSVDownloader } from 'svelte-csv';
    
    export let data: PageData;
    let parts: Part[] = data.parts;
    type Pie = { bjp:number, congress: number, fence:number};
    type ReligionPie = { [K in Religion]: Pie }
    type CastePie = { kuruba:Pie, lingayat:Pie, vokkaliga:Pie, sc:Pie}
    type VoterSpectrum = {
        faithfulCongress:number, 
        almostCongress:number,
        swingCongress:number,
        leaningCongress:number,
        center:number,
        leaningBjp:number,
        swingBjp:number,
        almostBjp:number,
        faithfulBjp:number
    }
    // type PartPie = { [partId:number]: Pie }
    // type EducationPie = { [K in Education]: { Pie }

    let pie:Pie = data.pie;
    let religionPie: ReligionPie = data.religionPie;
    // let educationPie: EducationPie = data.educationPie;
    // let partPie: PartPie = data.partPies;
    let castePies: CastePie = data.castePies;
    let voterSpectrum: VoterSpectrum = data.voterSpectrum;
    let swingVoters: Voter[] = data.swingVoters;
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
            await goto(`/dashboards?${searchParams.toString()}`, {
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
            <option selected={part.id===selectedPart} value={part.id}>{part.id} | {part.name}</option>
        {/each}
    </select>
    <button class="submit" type="submit"> Submit </button>
</form>

<h2> Overall Breakdown </h2>
<div class=pie-charts>
    <div class="chart-container">
    <Chart 
        colors={['#f97d09', '#138808', '#ECECEC']}
        data={{
            labels: ['BJP', 'Congress', 'On the Fence'],
            datasets: [
                {
                    values: [
                        pie.bjp, 
                        pie.congress, 
                        pie.fence
                    ],
                }
            ]
        }} type="pie" />
    </div>
</div>

<h2> Religion Breakdown </h2>
<div class=pie-charts>
    {#each Object.values(Religion) as religionOption}
        <div class="chart-container">
            <h5> {religionOption} </h5>
            <Chart 
                colors={['#f97d09', '#138808', '#ECECEC']}
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

<!-- 
<h2> Education Breakdown </h2>
<div class=pie-charts>
    {#each Object.values(Education) as educationOption}
        <div class="chart-container">
            <h5> {educationOption} </h5>
            <Chart 
                colors={['#f97d09', '#138808', '#ECECEC']}
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
</div> -->

<!-- <h2> Parts Breakdown </h2>
<div class=pie-charts>
    {#each parts as part}
        {#if partPie[part.id] && partPie[part.id].bjp > -1}
            <div class="chart-container">
                <h5> {part.id} | {part.name} </h5>
                <Chart 
                    colors={['#f97d09', '#138808', '#ECECEC']}
                    data={{
                        labels: ['BJP', 'Congress', 'On the Fence'],
                        datasets: [
                            {
                                values: [
                                    partPie[part.id].bjp, 
                                    partPie[part.id].congress, 
                                    partPie[part.id].fence
                                ],
                            }
                        ]
                    }} type="percentage" />
            </div>
        {/if}
    {/each}
</div> -->

<h2> Caste Breakdown </h2>
<div class=pie-charts>
    <div class="chart-container">
        <h5> Kuruba </h5>
        <Chart 
            colors={['#f97d09', '#138808', '#ECECEC']}
            data={{
                labels: ['BJP', 'Congress', 'On the Fence'],
                datasets: [
                    {
                        values: [
                            castePies.kuruba.bjp, 
                            castePies.kuruba.congress, 
                            castePies.kuruba.fence
                        ],
                    }
                ]
            }} type="pie" />
    </div>
    <div class="chart-container">
        <h5> Lingayat </h5>
        <Chart 
            colors={['#f97d09', '#138808', '#ECECEC']}
            data={{
                labels: ['BJP', 'Congress', 'On the Fence'],
                datasets: [
                    {
                        values: [
                            castePies.lingayat.bjp, 
                            castePies.lingayat.congress, 
                            castePies.lingayat.fence
                        ],
                    }
                ]
            }} type="pie" />
    </div>
    <div class="chart-container">
        <h5> Vokkaliga </h5>
        <Chart 
            colors={['#f97d09', '#138808', '#ECECEC']}
            data={{
                labels: ['BJP', 'Congress', 'On the Fence'],
                datasets: [
                    {
                        values: [
                            castePies.vokkaliga.bjp, 
                            castePies.vokkaliga.congress, 
                            castePies.vokkaliga.fence
                        ],
                    }
                ]
            }} type="pie" />
    </div>
    <div class="chart-container">
        <h5> SC </h5>
        <Chart 
            colors={['#f97d09', '#138808', '#ECECEC']}
            data={{
                labels: ['BJP', 'Congress', 'On the Fence'],
                datasets: [
                    {
                        values: [
                            castePies.sc.bjp, 
                            castePies.sc.congress, 
                            castePies.sc.fence
                        ],
                    }
                ]
            }} type="pie" />
    </div>
</div>

<h2> Voter Spectrum </h2>
<div class="chart-container">
<Chart 
    data={{
        labels: [
            "Congress Faithful",
            "Almost Certainly Congress",
            "Congress But Can Swing",
            "Leaning Congress",
            "Dead Center",
            "Leaning BJP",
            "BJP But Can Swing",
            "Almost Certainly BJP",
            "BJP Faithful",
        ],
        datasets: [
            {
                values: [
                    voterSpectrum.faithfulCongress,
                    voterSpectrum.almostCongress,
                    voterSpectrum.swingCongress,
                    voterSpectrum.leaningCongress,
                    voterSpectrum.center,
                    voterSpectrum.leaningBjp,
                    voterSpectrum.swingBjp,
                    voterSpectrum.almostBjp,
                    voterSpectrum.faithfulBjp
                ]
            }
        ]
    }} type="bar" />
</div>

<CSVDownloader
  data={swingVoters}
  filename={'filename'}
  bom={true}
>
  Download
</CSVDownloader>
<br /><br /><br /><br /><br />


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

