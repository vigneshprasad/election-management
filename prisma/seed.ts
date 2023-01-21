import PrismaClientPkg, { Gender, Relation } from '@prisma/client' 
import type { Voter } from '@prisma/client'
import { promises as fs } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const PrismaClient = PrismaClientPkg.PrismaClient
const prisma = new PrismaClient()

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

async function getVoters(id:number, file:string, hobli:string):  Promise<{voters:Voter[], id:number}> {
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
            hobli: hobli,
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
        ["/data/12.csv", "Nandagudi"],
        ["/data/13.csv", "Nandagudi"],
        ["/data/14.csv", "Nandagudi"],
        ["/data/15.csv", "Nandagudi"],
        ["/data/16.csv", "Nandagudi"],
        ["/data/17.csv", "Nandagudi"],
        ["/data/18.csv", "Nandagudi"],
        ["/data/19.csv", "Nandagudi"],
        ["/data/20.csv", "Sulibele"],
        ["/data/21.csv", "Sulibele"],
        ["/data/22.csv", "Sulibele"],
        ["/data/23.csv", "Sulibele"],
        ["/data/26.csv", "Sulibele"],
        ["/data/27.csv", "Sulibele"],
        ["/data/28.csv", "Sulibele"],
        ["/data/29.csv", "Sulibele"],
        ["/data/30.csv", "Nandagudi"],
        ["/data/31.csv", "Nandagudi"],
        ["/data/32.csv", "Nandagudi"],
        ["/data/33.csv", "Nandagudi"],
        ["/data/34.csv", "Nandagudi"],
        ["/data/35.csv", "Nandagudi"],
        ["/data/36.csv", "Tavarakere"],
        ["/data/37.csv", "Tavarakere"],
        ["/data/38.csv", "Tavarakere"],
        ["/data/39.csv", "Nandagudi"],
        ["/data/40.csv", "Nandagudi"],
        ["/data/41.csv", "Nandagudi"],
        ["/data/42.csv", "Nandagudi"],
        ["/data/43.csv", "Nandagudi"],
        ["/data/44.csv", "Nandagudi"],
        ["/data/45.csv", "Tavarakere"],
        ["/data/46.csv", "Tavarakere"],
        ["/data/47.csv", "Nandagudi"],
        ["/data/48.csv", "Tavarakere"],
        ["/data/49.csv", "Sulibele"],
        ["/data/50.csv", "Sulibele"]
    ]
    let idToPass = 7685;
    for(let j = 0; j < fileNames.length; j++) {
        const { voters, id } = await getVoters(idToPass, fileNames[j][0], fileNames[j][1])
        idToPass = id;
        if(voters.length == 0) {
            return;
        }
        console.log("PART", fileNames[j][0], "CREATING", voters.length);
        for (const voter of voters) {
            voter.slNoInPart;
            await prisma.voter.create({
                data: voter
            })
        }
        console.log("DONE WITH", fileNames[j][0], "CREATED", voters.length);
        console.log("---------------------");
    }
    
}

seedVoters()

// async function seedParts() {
//     const parts = [
//         [15,	"Karahalli"],
//         [16,	"Siddanahalli"],
//         [17,	"Vaddahalli"],
//         [18,	"Geddalahallipura"],
//         [19,	"Ramagovindapura"],
//         [20,	"Cheemasandra"],
//         [21,	"Anupahalli"],
//         [22,	"Dyavasandra"],
//         [23,	"Bendiganahalli"],
//         [26,	"Ankonahalli"],
//         [27,	"Thammarasanahalli"],
//         [28,	"Doddaralagere"],
//         [29,	"Thammarayasandra Agrahara"],
//         [30,	"Eastpart Nandagudi"],
//         [31,	"Nandagudi"],
//         [32,	"Westpart Nandagudi"],
//         [33,	"Haleyur"],
//         [34,	"Banahalli"],
//         [35,	"NHosahalli"],
//         [36,	"Korati"],
//         [37,	"Dinne Korati"],
//         [38,	"Hedakanahalli"],
//         [39,	"Bylanarasapura Room 1"],
//         [40,	"Bylanarasapura Room 2"],
//         [41,	"Bylanarasapura Room 3"],
//         [42,	"Bylaranasapura"],
//         [43,	"Kondrahalli"],
//         [44,	"Naduvinapura"],
//         [45,	"Oblahalli"],
//         [46,	"Mothakadahalli"],
//         [47,	"Chokkasandra"],
//         [48,	"Karapanahalli"],
//         [49,	"Bavapura"],
//         [50,	"Bhuvanahalli"]
//     ];
//     for(let i = 0; i < parts.length; i++) {
//         const part = parts[i]
//         await prisma.part.create({
//             data: {
//                 id: Number(part[0]),
//                 name: String(part[1])
//             }
//         })
//     }
// }

// seedParts()