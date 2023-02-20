<script lang="ts">
	import { applyAction, deserialize } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { generateRelationString } from "$root/lib/services/stringProcessingFunctions";
	import { Category, EconomicStatus, Education, Party, Religion, Candidate, Symbol, type Part, type Voter, YesNo, type Location } from "@prisma/client";
	import type { ActionResult } from "@sveltejs/kit";
	import { fade } from "svelte/transition";
	import type { PageData } from "./$types";

    export let data:PageData;
    let voter:Voter = data.voter;
    let parts:Part[] = data.parts;
    let user = data.user;

    let editLoading:boolean = false;
    let verifyLoading:boolean = false;

    $: ({ 
        id,
        name,
        gender,
        age,
        partId,
        epicNo,
        slNoInPart,
        relationName,
        relationType,
        religion,
        caste,
        subcaste,
        category,
        education,
        economicStatus,
        phone,
        profession,
        village,
        familyMembers,
        schemeAwareness,
        toiletConstruction,
        PMAwasYojanaHousing,
        PMStreetVendorAndMudraLoan,
        JalJeevanPipedWater,
        AyushmanHealthCard,
        AvailServices,
        WhichPartyResponsibleForSchemes,
        PartyWorkingForKarnataka,
        SymbolOfMTB,
        SymbolOfBachegowda,
        popularLeader,
        createdAt,
        updatedAt,
        verifiedBy,                      
        verifiedAt,
    } = voter);

    async function handleFormSubmit(this: any) {
        editLoading = true;
        let data = new FormData()
        const locationData = await getCoords();
        if(!locationData) {
            alert('Please enable location permissions');
            verifyLoading = false;
            return;
        }
        data.append('accuracy', String(locationData?.accuracy));
        data.append('altitude', String(locationData?.altitude));
        data.append('latitude', String(locationData?.latitude));
        data.append('longitude', String(locationData?.longitude));
        data.append('timestamp', String(locationData?.timestamp));
        data.append('id', String(id));
        religion && data.append('religion', String(religion));
        caste && data.append('caste', caste);
        subcaste && data.append('subcaste', subcaste);
        category && data.append('category', String(category));
        education && data.append('education', String(education));
        economicStatus && data.append('economicStatus', String(economicStatus));
        phone && data.append('phone', phone);
        profession && data.append('profession', profession);
        village && data.append('village', village);
        familyMembers && data.append('familyMembers', String(familyMembers));
        schemeAwareness != undefined && data.append('schemeAwareness', String(schemeAwareness));
        toiletConstruction != undefined && data.append('toiletConstruction', String(toiletConstruction));
        PMAwasYojanaHousing != undefined && data.append('PMAwasYojanaHousing', String(PMAwasYojanaHousing));
        PMStreetVendorAndMudraLoan != undefined && data.append('PMStreetVendorAndMudraLoan', String(PMStreetVendorAndMudraLoan));
        JalJeevanPipedWater != undefined && data.append('JalJeevanPipedWater', String(JalJeevanPipedWater));
        AyushmanHealthCard != undefined && data.append('AyushmanHealthCard', String(AyushmanHealthCard));
        AvailServices != undefined && data.append('AvailServices', String(AvailServices));
        WhichPartyResponsibleForSchemes && data.append('WhichPartyResponsibleForSchemes', String(WhichPartyResponsibleForSchemes));
        PartyWorkingForKarnataka && data.append('PartyWorkingForKarnataka', String(PartyWorkingForKarnataka));
        SymbolOfMTB && data.append('SymbolOfMTB', String(SymbolOfMTB));
        SymbolOfBachegowda && data.append('SymbolOfBachegowda', String(SymbolOfBachegowda));
        popularLeader && data.append('popularLeader', String(popularLeader));
        data.append('user', String(user.name));
        const response = await fetch(this.action, {
            method: 'POST',
            body: data
        });

        const result: ActionResult = deserialize(await response.text());

        if(result.type === 'success') {
            await invalidateAll()
        }

        applyAction(result);
        editLoading = false;
    }

    async function handleVerify(this: any) {
        verifyLoading = true;
        let data = new FormData();
        const locationData = await getCoords();
        if(!locationData) {
            alert('Please enable location permissions');
            verifyLoading = false;
            return;
        }
        data.append('accuracy', String(locationData.accuracy));
        data.append('altitude', String(locationData.altitude));
        data.append('latitude', String(locationData.latitude));
        data.append('longitude', String(locationData.longitude));
        data.append('timestamp', String(locationData.timestamp));
        data.append('user', String(user.name));
        data.append('id', String(voter.id));

        const response = await fetch(this.action, {
            method: 'POST',
            body: data
        });

        const result: ActionResult = deserialize(await response.text());

        if(result.type === 'success') { 
            verifiedAt = result?.data?.verifiedAt;
            verifiedBy = result?.data?.verifiedBy;
            await invalidateAll();
        }

        verifyLoading = false;
        applyAction(result)
    }

    const getCoords = async () => {
        const position:any = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
        });
    
        return {
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
        };
    };
    
</script>

<svelte:head>
    <title> {name} </title>
</svelte:head>

<article class="card" transition:fade>
    <h1 class="name">{name} </h1>
    <h5 class="details">{gender} {age}</h5>
    <h5 class="details">{generateRelationString(relationName, relationType, gender)}</h5>
    <h5 class="details"> Epic Number: {epicNo} </h5>
    <h5 class="details"> Part: {partId} </h5>
    <h5 class="details"> Sl No in Part: {slNoInPart} </h5>
</article>

<div class="form-container">
    <form class="form" method="POST" action="?/edit" on:submit|preventDefault={handleFormSubmit}>
        <h1> Survey Data </h1>
        <div class="survey-form">
            <label> 
                Religion
                <select id="religion" bind:value={religion}>
                    <option disabled selected={religion==undefined} value={undefined}>Select a Religion</option>
                    {#each Object.keys(Religion) as religionOption}
                        <option selected={religion===religionOption} value={religionOption}>{religionOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                Caste
                <input name="caste" type="text" placeholder="Enter Caste" bind:value={caste}>
            </label>
            <label> 
                Subcaste
                <input name="subcaste" type="text" placeholder="Enter Subcaste" bind:value={subcaste}>
            </label>
            <label> 
                Category
                <select id="category" bind:value={category}>
                    <option disabled selected={category==undefined} value={undefined}>Select a Category</option>
                    {#each Object.keys(Category) as categoryOption}
                        <option selected={category===categoryOption} value={categoryOption}>{categoryOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                Education
                <select id="education" bind:value={education}>
                    <option disabled selected={education==undefined} value={undefined}>Select Level of Education</option>
                    {#each Object.keys(Education) as educationOption}
                        <option selected={education===educationOption} value={educationOption}>{educationOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                Economic Status
                <select id="economicStatus" bind:value={economicStatus}>
                    <option disabled selected={economicStatus==undefined} value={undefined}>Select Economic Status</option>
                    {#each Object.keys(EconomicStatus) as economicStatusOption}
                        <option selected={economicStatus===economicStatusOption} value={economicStatusOption}>{economicStatusOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                Phone
                <input name="phone" type="text" placeholder="Enter phone number without any extension" bind:value={phone}>
            </label>
            <label> 
                Profession
                <input name="profession" type="text" placeholder="Enter Profession" bind:value={profession}>
            </label>
            <label> 
                Village
                <input name="village" type="text" placeholder="Enter Village Name" bind:value={village}>
            </label>
            <label> 
                Family Members
                <input name="familymembers" type="number" placeholder="No. of Family Members" bind:value={familyMembers}>
            </label>
            <br />
        </div>
        <h1> Govt. Schemes Survey</h1>
        <div class="schemes-form">
            <label> 
                Are you aware of the Central Govt and State Govt schemes?
                <select id="schemeAwareness" bind:value={schemeAwareness}>
                    <option disabled selected={schemeAwareness==undefined} value={undefined}>Select Yes or No</option>
                    {#each Object.keys(YesNo) as yesNoOption}
                        <option selected={schemeAwareness===yesNoOption} value={yesNoOption}>{yesNoOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                Have you got toilets constructed from the Government?
                <select id="toiletConstruction" bind:value={toiletConstruction}>
                    <option disabled selected={toiletConstruction==undefined} value={undefined}>Select Yes or No</option>
                    {#each Object.keys(YesNo) as yesNoOption}
                        <option selected={toiletConstruction===yesNoOption} value={yesNoOption}>{yesNoOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                Have you got benefited from the PM Awas Yojana Housing scheme?
                <select id="PMAwasYojanaHousing" bind:value={PMAwasYojanaHousing}>
                    <option disabled selected={PMAwasYojanaHousing==undefined} value={undefined}>Select Option</option>
                    <option selected={PMAwasYojanaHousing===YesNo.YES} value={YesNo.YES}>Yes</option>
                    <option selected={PMAwasYojanaHousing===YesNo.NO} value={YesNo.NO}>No</option>
                </select>
            </label>
            <label> 
                Are you aware of PM Street Vendor Loan & Mudra Loan?
                <select id="PMStreetVendorAndMudraLoan" bind:value={PMStreetVendorAndMudraLoan}>
                    <option disabled selected={PMStreetVendorAndMudraLoan==undefined} value={undefined}>Select Option</option>
                    <option selected={PMStreetVendorAndMudraLoan===YesNo.YES} value={YesNo.YES}>Yes</option>
                    <option selected={PMStreetVendorAndMudraLoan===YesNo.NO} value={YesNo.NO}>No</option>
                </select>
            </label>
            <label> 
                Are you getting water at home through Jal Jeevan Piped Water connection?
                <select id="JalJeevanPipedWater" bind:value={JalJeevanPipedWater}>
                    <option disabled selected={JalJeevanPipedWater==undefined} value={undefined}>Select Option</option>
                    <option selected={JalJeevanPipedWater===YesNo.YES} value={YesNo.YES}>Yes</option>
                    <option selected={JalJeevanPipedWater===YesNo.NO} value={YesNo.NO}>No</option>
                </select>
            </label>
            <label> 
                Have you received Ayushman Health Card?
                <select id="AyushmanHealthCard" bind:value={AyushmanHealthCard}>
                    <option disabled selected={AyushmanHealthCard==undefined} value={undefined}>Select Option</option>
                    <option selected={AyushmanHealthCard===YesNo.YES} value={YesNo.YES}>Yes</option>
                    <option selected={AyushmanHealthCard===YesNo.NO} value={YesNo.NO}>No</option>
                </select>
            </label>
            <label> 
                Do you wish to avail any of the above?
                <select id="AvailServices" bind:value={AvailServices}>
                    <option disabled selected={AvailServices==undefined} value={undefined}>Select Option</option>
                    <option selected={AvailServices===YesNo.YES} value={YesNo.YES}>Yes</option>
                    <option selected={AvailServices===YesNo.NO} value={YesNo.NO}>No</option>
                </select>
            </label>
            <br />
        </div>
        <h1> Party Survey</h1>
        <div class="choice-form">
            <label> 
                Do you know which Government and party had announced these schemes? If Yes which party & Government?
                <select id="WhichPartyResponsibleForSchemes" bind:value={WhichPartyResponsibleForSchemes}>
                    <option disabled selected={WhichPartyResponsibleForSchemes==undefined} value={undefined}>Select Party</option>
                    {#each Object.keys(Party) as partyOption}
                        <option selected={WhichPartyResponsibleForSchemes===partyOption} value={partyOption}>{partyOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                According to you, which party is working for the development of Karnataka?
                <select id="PartyWorkingForKarnataka" bind:value={PartyWorkingForKarnataka}>
                    <option disabled selected={PartyWorkingForKarnataka==undefined} value={undefined}>Select Party</option>
                    {#each Object.keys(Party) as partyOption}
                        <option selected={PartyWorkingForKarnataka===partyOption} value={partyOption}>{partyOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                What is the symbol of MTB Nagaraj & MTB Rajesh?
                <select id="SymbolOfMTB" bind:value={SymbolOfMTB}>
                    <option disabled selected={SymbolOfMTB==undefined} value={undefined}>Select Symbol</option>
                    {#each Object.keys(Symbol) as symbolOption}
                        <option selected={SymbolOfMTB===symbolOption} value={symbolOption}>{symbolOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                What is the symbol of Sharad Bachegowda?
                <select id="SymbolOfBachegowda" bind:value={SymbolOfBachegowda}>
                    <option disabled selected={SymbolOfBachegowda==undefined} value={undefined}>Select Symbol</option>
                    {#each Object.keys(Symbol)  as symbolOption}
                        <option selected={SymbolOfBachegowda===symbolOption} value={symbolOption}>{symbolOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                Who is the most popular leader in your area?
                <select id="popularLeader" bind:value={popularLeader}>
                    <option disabled selected={popularLeader==undefined} value={undefined}>Select Leader</option>
                    {#each Object.keys(Candidate) as candidateOption}
                        <option selected={popularLeader===candidateOption} value={candidateOption}>{candidateOption}</option>
                    {/each}
                </select>
            </label>
        </div>
        <button type="submit" disabled={editLoading} aria-busy={editLoading}> Save </button>
    </form>

    <br />
    <h1> Other Details </h1>
    <p> Created at: {createdAt.toString()}</p>
    <p> Last Updated at: {updatedAt.toString()}</p>
    {#if verifiedAt && verifiedBy}
        <p> Verified By: {verifiedBy.toString()}</p>
        <p> Verified at: {verifiedAt?.toString()}</p>
    {:else}
        <p> Voter - Unverified </p>
        <form class="form" method="POST" action="?/verify" on:submit|preventDefault={handleVerify}>
            <button type="submit" disabled={verifyLoading} aria-busy={verifyLoading}> Verify Now </button>
        </form>
    {/if}
</div>


<style>
	.form-container {
        margin-top: 64px;
	}

    h1 {
        margin-bottom: 16px;
        margin-top: 16px
    }

    .name {
        margin-top: 0px;
    }

    .card {
        margin-top: 64px;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        padding: 8px 16px;
        display: flex;
        flex-direction: column;
    }

    .survey-form, .schemes-form, .choice-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 16px;
    }

    .details {
        margin: 0
    }

    @media (max-width: 480px) {
        .survey-form, .schemes-form, .choice-form {
            display: grid;
            grid-template-columns: 1fr;
            grid-column-gap: 16px;
        }
    }
  
</style>