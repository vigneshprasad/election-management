// import PrismaClientPkg, { Gender, Relation } from '@prisma/client' 
// import type { Voter } from '@prisma/client'
// import { promises as fs } from 'fs'
// import { dirname } from 'path'
// import { fileURLToPath } from 'url'

// const PrismaClient = PrismaClientPkg.PrismaClient
// const prisma = new PrismaClient()

// function convertStringToGender(str: string):Gender {
//     if(str === 'M') {
//         return Gender.M
//     } else if (str === 'F') {
//         return Gender.F
//     } else if (str == 'T') {
//         return Gender.T
//     } else {
//         console.error("Something went wrong converting gender: ", str);
//         return Gender.M
//     }
// }

// function convertStringToRelationType(str: string):Relation {
//     str = str.trim()
//     if(str === 'F') {
//         return Relation.F
//     } else if (str === 'M') {
//         return Relation.M
//     } else if (str == 'H') {
//         return Relation.H
//     } else if (str == 'O') {
//         return Relation.O
//     } else {
//         console.error("Something went wrong converting relation type: ", str);
//         return Relation.F
//     }
// }

// async function getVoters(id:number, file:string, hobli:string):  Promise<{voters:Voter[], id:number}> {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = dirname(__filename)
//     const pathName = __dirname + file; 
//     const voters: Voter[] = []
//     const data = await fs.readFile(pathName)
//     const bufferString = data.toString();
//     const arr = bufferString.split('\n');
//     for (let i = 1; i < arr.length; i++) {
//         const data = arr[i].split(',');
//         voters.push({
//             acNo: Number(data[1]),
//             partId: Number(data[2]),
//             slNoInPart: Number(data[3]),
//             epicNo: data[5],
//             name: data[6],
//             age: Number(data[7]),
//             gender: convertStringToGender(data[8]),
//             relationName: data[9],
//             relationType: convertStringToRelationType(data[10]),
//             hobli: hobli,
//             id: id,
//             religion: null,
//             caste: null,
//             subcaste: null,
//             category: null,
//             education: null,
//             economicStatus: null,
//             phone: null,
//             profession: null,
//             village: null,
//             familyMembers: null,
//             schemeAwareness: null,
//             toiletConstruction: null,
//             PMAwasYojanaHousing: null,
//             PMStreetVendorAndMudraLoan: null,
//             JalJeevanPipedWater: null,
//             AyushmanHealthCard: null,
//             AvailServices: null,
//             WhichPartyResponsibleForSchemes: null,
//             PartyWorkingForKarnataka: null,
//             SymbolOfMTB: null,
//             SymbolOfBachegowda: null,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             popularLeader: null,
//             verifiedBy: null,
//             verifiedAt: null
//         })
//         id = id + 1
//     }
//     return { 
//         voters: voters,
//         id: id
//     }
// }

// async function seedVoters() {
//     const fileNames = [
//         ["/data/158.csv", "Hosakote Town"],
//     ]
//     let idToPass = 86285;
//     for(let j = 0; j < fileNames.length; j++) {
//         console.log("PART", fileNames[j][0], "PREPARING", new Date());
//         const { voters, id } = await getVoters(idToPass, fileNames[j][0], fileNames[j][1])
//         idToPass = id;
//         if(voters.length == 0) {
//             return;
//         }
//         console.log("PART", fileNames[j][0], "CREATING", voters.length, new Date());
//         let count = 0;
//         for (const voter of voters) {
//             if(count % 10 == 0) {
//                 console.log(count);
//             } 
//             count += 1;
//             voter.slNoInPart;
//             await prisma.voter.create({
//                 data: voter
//             })
//         }
//         console.log("DONE WITH", fileNames[j][0], "CREATED", voters.length, new Date());
//         console.log("---------------------");
//     }
//     console.log(idToPass);
    
// }

// seedVoters()

// // async function seedParts() {
// //     const parts = [
// //         [51,	"K Sathyawara"],
// //         [52,	"Gullahalli"],
// //         [53,	"Bettahalli"],
// //         [54,	"Giddappanahalli"],
// //         [55,	"Valagerepura"],
// //         [56,	"Sulibele Room Kannada School Room 1"],
// //         [57,	"Sulibele Room Kannada School Room 2"],
// //         [58,	"Sulibele Urdu School Room 1"],
// //         [59,	"Sulibele Urdu School Room 2"],
// //         [60,	"Sulibele High School Room 1"],
// //         [61,	"Sulibele High School Room 2"],
// //         [62,	"Sulibele High School Room 3"],
// //         [63,	"Sulibele High School Room 4"],
// //         [64,	"Sulibele High School Room 5"],
// //         [65,	"Kadarinapura"],
// //         [66,	"Attibele Room 1"],
// //         [67,	"Attibele Room 2"],
// //         [68,	"Sadappanahalli"],
// //         [69,	"Yenagunte"],
// //         [70,	"Kammasandra"],
// //         [71,	"Hasigala"],
// //         [72,	"Sonnahallipura"],
// //         [73,	"MSathyawara"],
// //         [74,	"Muthasandra"],
// //         [75,	"Doddakoliga"],
// //         [76,	"Nagarenahalli"],
// //         [77,	"Muthukadahalli"],
// //         [78,	"Begur Room 1"],
// //         [79,	"Begur Room 2"],
// //         [80,	"Bheemakkanahalli"],
// //         [81,	"Kembaliganahalli Room 1"],
// //         [82,	"Kembaliganahalli Room 2"],
// //         [83,	"Chinnathimmanagolla Halli"],
// //         [84,	"Malliyappanahalli"],
// //         [85,	"DShettahalli"],
// //         [86,	"Bisanahalli"],
// //         [87,	"Shivanapura Room 1"],
// //         [88,	"Shivanapura Room 2"],
// //         [89,	"Shivanapura Room 3"],
// //         [90,	"Bheemapura"],
// //         [91,	"Chikkanahalli"],
// //         [92,	"Hethakki"],
// //         [93,	"Lingapura"],
// //         [94,	"Marasandahalli"],
// //         [95,	"Gangapura"],
// //         [97,	"Thavarekere Room 1"],
// //         [98,	"Thavarakere Room 2"],
// //         [99,	"Manchapanahalli"],
// //         [100,	"Kalappanahalli"],
// //         [101,	"Yelachahalli"],
// //         [102,	"Poojaramanahalli"],
// //         [103,	"Mugabala Room 1"],
// //         [104,	"Mugabala Room 2"],
// //         [105,	"Doddanallurahalli Room 1"],
// //         [106,	"Doddanallurahalli Room 2"],
// //         [107,	"Malimakanapura"],
// //         [108,	"Chikkanallurahalli"],
// //         [109,	"Cholappanahalli"],
// //         [110,	"Chokkahalli"],
// //         [111,	"Pillagumpe"],
// //         [112,	"Kamblipura Room 1"],
// //         [113,	"Kamblipura Room 2"],
// //         [114,	"Thimmasandra"],
// //         [115,	"Vabasandra"],
// //         [117,	"Lakkondahalli"],
// //         [118,	"Shankanipura"],
// //         [119,	"Alappanahalli"],
// //         [120,	"Kallahalli"],
// //         [121,	"Kurubarahalli Room 1"],
// //         [122,	"Kurubarahalli Room 2"],
// //         [123,	"Doddahullur Primary School"],
// //         [124,	"Doddahullur Panchayat Hall"],
// //         [125,	"Chikkahullur"]
// //     ];
// //     for(let i = 0; i < parts.length; i++) {
// //         const part = parts[i]
// //         await prisma.part.create({
// //             data: {
// //                 id: Number(part[0]),
// //                 name: String(part[1])
// //             }
// //         })
// //     }
// // }

// // seedParts()


import PrismaClientPkg, { Category, Education, EconomicStatus, YesNo, Candidate, Party, Religion } from '@prisma/client' 

import { compareTwoStrings } from "string-similarity";
import { promises as fs } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const PrismaClient = PrismaClientPkg.PrismaClient
const prisma = new PrismaClient()

type VoterType = { epicNo: string, name: string, age: number, gender: string, complete:boolean };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const pathName = __dirname + '/data/158.csv'; 
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

const pathName2 = __dirname + '/data/153survey.csv'; 
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
            console.log(voter, person);
            const newVoter = await prisma.voter.update({
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
            })
            console.log(newVoter);
        }
    }
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
    if(leader.includes("Sharath Bache  Gowda")) {
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

console.log(count);