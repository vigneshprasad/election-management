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
    } else {
        console.error("Something went wrong converting relation type: ", str);
        return Relation.F
    }
}

async function getVoters(): Promise<Voter[]> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename)
    const pathName = __dirname + '/data/thimmappanahalli.csv'; 
    const voters: Voter[] = []
    const data = await fs.readFile(pathName)
    let id = 517
    const bufferString = data.toString();
    const arr = bufferString.split('\n');
    for (let i = 1; i < arr.length; i++) {
        const data = arr[i].split(',');
        voters.push({
            name: data[0],
            gender: convertStringToGender(data[1]),
            age: Number(data[2]),
            epicNo: data[3],
            partId: Number(data[4]),
            acNo: Number(data[5]),
            slNoInPart: Number(data[6]),
            hobli: data[7],
            relationName: data[8],
            relationType: convertStringToRelationType(data[9]),
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
            boothNumber: null,
            familyMembers: null,
            maleFamilyMembers: null,
            femaleFamilyMembers: null,
            childFamilyMembers: null,
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
        })
        id = id + 1
    }
    return voters
}

async function seedVoters() {
    const voters = await getVoters()
    if(voters.length == 0) {
        return;
    }
    for (const voter of voters) {
        await prisma.voter.create({
            data: voter
        })
    }
}

seedVoters()