import PrismaClientPkg, { Candidate, Category, EconomicStatus, Education, Gender, Party, Relation, Religion, YesNo } from '@prisma/client' 
import type { Voter } from '@prisma/client'
import { promises as fs } from 'fs'
import { compareTwoStrings } from "string-similarity";
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const PrismaClient = PrismaClientPkg.PrismaClient
const prisma = new PrismaClient()

type VoterType = { epicNo: string, name: string, age: number, gender: string, complete:boolean };

function convertStringToGender(str: string):Gender {
    if(str === 'M') {
        return Gender.M
    } else if (str === 'F') {
        return Gender.F
    } else if (str == 'T') {
        return Gender.T
    } else {
        console.error("Something went wrong converting gender: ", str);
        return Gender.M
    }
}

function convertStringToRelationType(str: string):Relation {
    str = str.trim()
    if(str === 'F') {
        return Relation.F
    } else if (str === 'M') {
        return Relation.M
    } else if (str == 'H') {
        return Relation.H
    } else if (str == 'O') {
        return Relation.O
    } else {
        console.error("Something went wrong converting relation type: ", str);
        return Relation.F
    }
}

async function getVoters(id:number, file:string):  Promise<{voters:Voter[], id:number}> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename)
    const pathName = __dirname + file; 
    const voters: Voter[] = []
    const data = await fs.readFile(pathName)
    const bufferString = data.toString();
    const arr = bufferString.split('\n');
    for (let i = 1; i < arr.length; i++) {
        const data = arr[i].split(',');
        voters.push({
            acNo: Number(data[1]),
            partId: Number(data[2]),
            slNoInPart: Number(data[3]),
            epicNo: data[5],
            name: data[6],
            age: Number(data[7]),
            gender: convertStringToGender(data[8]),
            relationName: data[9],
            relationType: convertStringToRelationType(data[10]),
            id: id,
            religion: null,
            caste: null,
            subcaste: null,
            category: null,
            education: null,
            economicStatus: null,
            phone: null,
            profession: null,
            village: null,
            familyMembers: null,
            schemeAwareness: null,
            toiletConstruction: null,
            PMAwasYojanaHousing: null,
            PMStreetVendorAndMudraLoan: null,
            JalJeevanPipedWater: null,
            AyushmanHealthCard: null,
            AvailServices: null,
            WhichPartyResponsibleForSchemes: null,
            PartyWorkingForKarnataka: null,
            SymbolOfMTB: null,
            SymbolOfBachegowda: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            popularLeader: null,
            verifiedBy: null,
            verifiedAt: null
        })
        id = id + 1
    }
    return { 
        voters: voters,
        id: id
    }
}

async function seedVoters() {
    const fileNames = [
        "/data/151.csv",
        "/data/155.csv",
        "/data/156.csv",
        "/data/158.csv",
        "/data/159.csv",
        "/data/175.csv",
        "/data/180.csv",
        "/data/182.csv",
    ]
    let idToPass = 1;
    for(let j = 0; j < fileNames.length; j++) {
        console.log("PART", fileNames[j], "PREPARING", new Date());
        const { voters, id } = await getVoters(idToPass, fileNames[j])
        idToPass = id;
        if(voters.length == 0) {
            return;
        }
        console.log("PART", fileNames[j], "CREATING", voters.length, new Date());
        let count = 0;
        for (const voter of voters) {
            if(count % 10 == 0) {
                console.log(count);
            } 
            count += 1;
            voter.slNoInPart;
            await prisma.voter.create({
                data: voter
            })
        }
        console.log("DONE WITH", fileNames[j], "CREATED", voters.length, new Date());
        console.log("---------------------");
    }
    console.log(idToPass);
    
}

async function seedParts() {
    const parts:[id:number, name:string][] = [
        [189, "Hoskote Town Govt Higher Middle School Near Bus Stand Room 2"],
        [190, "Dandupalya"],
        [191, "Siddharthanagar"],
        [192, "Vardapura"],
        [193, "Kolathur"],
        [194, "Haralur"],
        [195, "Solur"],
        [196, "Orohalli"],
        [197, "Injanahalli"],
        [198, "Appasandra"],
        [199, ""],
        [200, "Doddadenehalli"],
        [201, "Alagondahalli"],
    ];
    for(let i = 0; i < parts.length; i++) {
        const part = parts[i]
        console.log("Creating: ", part)
        await prisma.part.create({
            data: {
                id: Number(part[0]),
                name: String(part[1])
            }
        })
    }
}


async function uploadData(surveyfilename:string, voterfilename:string, dry_run:boolean) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename)
    const pathName = __dirname + voterfilename; 
    const voters: VoterType[] = []
    const data = await fs.readFile(pathName)
    const bufferString = data.toString();
    const arr = bufferString.split('\n');
    for (let i = 1; i < arr.length; i++) {
        const data = arr[i].split(',');
        voters.push({
            epicNo: data[5],
            name: data[6],
            age: Number(data[7]),
            gender: data[8],
            complete: false,
        })
    }

    const pathName2 = __dirname + surveyfilename; 
    const surveyData: {
        timestamp: string,
        name: string,
        gender: string, 
        age: number, 
        religion: string,
        caste: string,
        subcaste: string,
        category: string,
        education: string,
        economicStatus: string,
        phone: string, 
        profession: string,
        address: string, 
        familyMembers: number,
        PMStreetVendorAndMudraLoan: string
        JalJeevanPipedWater: string,
        AyushmanHealthCard: string,
        PartyWorkingForKarnataka: string,
        popularLeader: string
    }[] = []
    const data2 = await fs.readFile(pathName2)
    const bufferString2 = data2.toString();
    const arr2 = bufferString2.split('\n');
    for (let i = 0; i < arr2.length; i++) {
        const data = arr2[i].split(',');
        surveyData.push({
            timestamp: data[0],
            name: data[2],
            gender: data[3].includes('Female') ? "F" : data.includes("Trans") ? "T" : "M",
            age: Number(data[4]),
            religion: data[5],
            caste: data[6],
            subcaste: data[7],
            category: data[8],
            education: data[9],
            economicStatus: data[10],
            phone: data[11], 
            profession: data[12],
            address: data[13],
            familyMembers: Number(data[14]),
            PMStreetVendorAndMudraLoan: data[15],
            JalJeevanPipedWater: data[16],
            AyushmanHealthCard: data[17],
            PartyWorkingForKarnataka: data[18],
            popularLeader: data[19]
        })
    }

    let count = 0;

    for(let i=0; i < surveyData.length; i++) {
        const person = surveyData[i];
        let match = false;
        let maxMatch = 0
        let finalVoter:VoterType|undefined= undefined;
        for(let j=0; j< voters.length; j++) {
            const voter = voters[j]
            if(voter.complete) {
                continue
            }
            if(voter.gender !== person.gender) {
                continue
            }
            if(voter.age - person.age < 1 || voter.age - person.age > 4) {
                continue
            }
            const comp = compareTwoStrings(person.name, voter.name);
            if(comp < 0.6) {
                continue
            }
            // if(voter.name[0].toLowerCase() !== person.name[0].toLowerCase()) {
            //     continue
            // }
            if(comp > maxMatch) {
                match = true;
                maxMatch = comp;
                if(finalVoter) {
                    finalVoter.complete = false;
                } 
                voter.complete = true;
                finalVoter = voter;
            }
            if(match) {
                count += 1
                console.log(voter, person)
                if(dry_run) {
                    continue
                }
                await prisma.voter.update({
                    where: {
                        epicNo: voter.epicNo
                    },
                    data: {
                        religion: person.religion && sanitiseReligion(person.religion) || undefined,
                        caste: String(person.caste) || undefined,
                        subcaste: String(person.subcaste) || undefined,
                        category: person.category && sanitiseCategory(person.category) || undefined,
                        education: person.education && sanitiseEducation(person.education) || undefined,
                        economicStatus: person.economicStatus && sanitiseEconomicStatus(person.economicStatus) || undefined,
                        phone: person.phone || undefined,
                        profession: person.profession || undefined,
                        village: person.address || undefined,
                        familyMembers: person.familyMembers || undefined,
                        PMStreetVendorAndMudraLoan: YesNo[person.PMStreetVendorAndMudraLoan as keyof typeof YesNo] || undefined,
                        JalJeevanPipedWater: YesNo[person.JalJeevanPipedWater as keyof typeof YesNo] || undefined,
                        AyushmanHealthCard: YesNo[person.AyushmanHealthCard as keyof typeof YesNo] || undefined,
                        PartyWorkingForKarnataka: Party[person.PartyWorkingForKarnataka as keyof typeof Party] || undefined,
                        popularLeader: person.popularLeader && sanitiseLeader(person.popularLeader) || undefined,     
                    }
                });
            }
        }
    }
    console.log(count);
}

function sanitiseReligion(religion:string) : Religion {
    if(religion.includes("Hindu")) {
        return Religion.HINDU
    } 
    if(religion.includes("Muslim")) {
        return Religion.MUSLIM
    }
    if(religion.includes("Christian")) {
        return Religion.CHRISTIAN
    } 
    return Religion.OTHER
}

function sanitiseCategory(category:string) : Category {
    if(category.includes("General")) {
        return Category.GENERAL
    } 
    if(category.includes("SC")) {
        return Category.SCST
    }
    if(category.includes("BC")) {
        return Category.OBC
    } 
    return Category.GENERAL
}

function sanitiseEducation(education:string) : Education {
    if(education.includes("Primary")) {
        return Education.PRIMARY
    } 
    if(education.includes("Middle")) {
        return Education.MIDDLE
    }
    if(education.includes("Post Matriculation")) {
        return Education.POSTMATRICULATION
    }
    if(education.includes("Matriculation")) {
        return Education.MATRICULATION
    } 
    if(education.includes("Post Graduation")) {
        return Education.POSTGRADUATION
    } 
    if(education.includes("Graduation")) {
        return Education.GRADUATION
    } 
    return Education.ILLITERATE
}

function sanitiseEconomicStatus(status:string) : EconomicStatus {
    if(status.includes("BPL")) {
        return EconomicStatus.BPL
    } 
    return EconomicStatus.APL
}

function sanitiseLeader(leader:string) : Candidate {
    if(leader.includes("Sharath")) {
        return Candidate.SHARATHBACHEGOWDA
    } 
    if(leader.includes("Bache Gowda")) {
        return Candidate.BACHEGOWDA
    } 
    if(leader.includes("MTB Rajesh")) {
        return Candidate.MTBRAJESH
    }
    if(leader.includes("MTB Nagaraj")) {
        return Candidate.MTBNAGARAJ
    }  
    return Candidate.UNKNOWN
}

seedVoters()

// uploadData('/data/survey/151.csv', '/data/151.csv', true)
// uploadData('/data/survey/158.csv', '/data/158.csv', true)
// seedParts()
