<script lang="ts">
	import { applyAction, deserialize } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { Category, EconomicStatus, Education, Gender, Party, Relation, Religion, Candidate, Symbol, type Part, type Voter, YesNo } from "@prisma/client";
	import type { ActionResult } from "@sveltejs/kit";
	import type { PageData } from "./$types";

    export let data:PageData;
    let voter:Voter = data.voter;
    let parts:Part[] = data.parts;
    let user = data.user;

    $: ({ 
        id,
        name,
        gender,
        age,
        partId,
        epicNo,
        acNo,
        slNoInPart,
        hobli,
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
        let data = new FormData()
        data.append('id', String(id));
        name && data.append('name', name);
        gender && data.append('gender', gender);
        age && data.append('age', String(age));
        partId && data.append('age', String(partId));
        epicNo && data.append('epicNo', epicNo);
        acNo && data.append('acNo', String(acNo));
        slNoInPart && data.append('slNoInPart', String(slNoInPart));
        hobli && data.append('hobli', hobli);
        relationName && data.append('relationName', relationName);
        relationType && data.append('relationType', relationType);
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

        applyAction(result)
    }

    async function handleVerify(this: any) {
        let data = new FormData();
        data.append('user', String(user.name));

        const response = await fetch(this.action, {
            method: 'POST',
            body: data
        });

        const result: ActionResult = deserialize(await response.text());

        if(result.type === 'success') {
            await invalidateAll()
        }

        applyAction(result)
    }
    
</script>

<div class="container">
    <form class="form" method="POST" action="?/edit" on:submit|preventDefault={handleFormSubmit}>
        <div>
            <h1> Voter List Data </h1>
            <label> 
                Name 
                <input name="name" type="text" bind:value={name} required>
            </label>
            <label> 
                Gender 
                <select id="gender" bind:value={gender} required>
                    {#each Object.keys(Gender) as genderOption}
                        <option selected={gender===genderOption} value={genderOption}>{genderOption}</option>
                    {/each}
                </select>
            </label>
            <label> 
                Age 
                <input name="age" type="text" bind:value={age} required>
            </label>
            <label> 
                Part 
                <select id="partId" bind:value={partId} required>
                    <option disabled selected={partId==undefined} value={undefined}>Select a Part</option>
                    {#each parts as part}
                        <option selected={part.id===partId} value={part.id}>{part.name}</option>
                    {/each}
                </select>
            </label>
            <label> 
                Epic Number
                <input name="epicNo" type="text" bind:value={epicNo} required>
            </label>
            <label> 
                Ac Number
                <input name="acNo" type="number" bind:value={acNo} required>
            </label>
            <label> 
                Sl No in Part
                <input name="slNoInPart" type="number" bind:value={slNoInPart} required>
            </label>
            <label> 
                Hobli
                <input name="hobli" type="text" bind:value={hobli} required>
            </label>
            <label> 
                Relation Name
                <input name="relationName" type="text" bind:value={relationName} required>
            </label>
            <label> 
                Relation Type
                <select id="relationType" bind:value={relationType} required>
                    <option disabled selected={relationType==undefined} value={undefined}>Select a Relation Type</option>
                    {#each Object.keys(Relation) as relationOption}
                        <option selected={relationType===relationOption} value={relationOption}>{relationOption}</option>
                    {/each}
                </select>
            </label>
            <br />
            <br />
        </div>
        <div>
            <h1> Survey Data </h1>
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
        <div>
            <h1> Govt. Schemes Survey</h1>
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
        <div>
            <h1> Party Survey</h1>
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
        <button type="submit" class="btn"> Save </button>
    </form>

    <br />
    <br />
    <h1> Other Details </h1>
    <p> Created at: {createdAt.toString()}</p>
    <p> Last Updated at: {updatedAt.toString()}</p>
    {#if verifiedAt && verifiedBy}
        <p> Verified By: {verifiedBy.toString()}</p>
        <p> Verified at: {verifiedAt?.toString()}</p>
    {:else}
        <p> Voter unverified </p>
        <form class="form" method="POST" action="?/verify" on:submit|preventDefault={handleVerify}>
            <button type="submit" class="btn"> Verify Now </button>
        </form>
    {/if}
</div>


<style>
	.container {
		display: grid;
		align-items: center;
		gap: var(--spacing-16);
		padding: var(--spacing-16) var(--spacing-24);
		border-bottom: 1px solid var(--color-border-primary);
	}

	form {
        display: flex;
        flex-direction: column;
		gap: var(--spacing-16) var(--spacing-16);
	}

	input {
		color: var(--color-text-primary);
		background-color: transparent;
	}

	button {
		max-width: 80px;
		font-size: var(--font-16);
		padding: var(--spacing-16);
	}
</style>