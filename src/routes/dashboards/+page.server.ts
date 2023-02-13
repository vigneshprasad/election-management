import prisma from '$root/lib/prisma'
import { Candidate, Education, Party, Religion, type Part, type Voter } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit'; 
import type { PageServerLoad } from '../$types';

type Pie = { bjp:number, congress: number, fence:number};
type PartPie = { [partId:number]: Pie }
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
// type EducationPie = { [K in Education]: Pie }


export const load = (async ({ locals, url }) => {
    if(!locals.user) {
        throw redirect(302, '/login');
    }
    const userPermissions = await prisma.userPermissions.findUnique({
        where: {
            user: locals?.user?.name
        }
    })
    if(!userPermissions?.isAdmin) {
        throw error(404, `No admin permissions`);
    } 

    // OVERALL DASHBOARD:
    // - By Religion
    // - By Education
    // - By Caste - NEED TO STANDARDISE TO ENUM
    // - By Mudra Loan
    // - By Jal Jeevan
    // - By Ayush

    const parts = await getParts();
    const partId = Number(url.searchParams.get('partId'))

    const pie = await getOverallPie(partId);
    const religionPie = await getReligionPies(partId);
    // const educationPie = await getEducationPies();
    // const partPies = await getPartPies();
    const castePies = await getCastePies(partId);
    const { voterSpectrum, swingVoters } = await getVoterSpectrum(partId);

        
    return {
        parts, pie, religionPie, castePies, voterSpectrum, swingVoters
    };
}) satisfies PageServerLoad;

async function getParts(): Promise<Part[]> {
    const voterParts = await prisma.voter.findMany({
        where: {
            religion: {
                not: null
            } 
        },
        select: {
            part: true
        }
    });
    const parts:Part[] = []
    const partIds:number[] = []
    voterParts.forEach((part)=> {
        if(partIds.indexOf(part.part.id) === -1) {
            parts.push(part.part);
            partIds.push(part.part.id);
        }
    })
    return parts;

}

async function getOverallPie(partId:number|undefined) {
    if(partId === 0) {
        partId = undefined
    }
    const bjp = await prisma.voter.findMany({
        where: {
            partId: partId,
            OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
            PartyWorkingForKarnataka: Party.BJP
        },
    })

    const congress = await prisma.voter.findMany({
        where: {
            partId: partId,
            OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
            PartyWorkingForKarnataka: Party.CONGRESS
        },
    })

    const onTheFence = await prisma.voter.findMany({
        where: {
            partId: partId,
            OR: [
                {
                    OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
                    PartyWorkingForKarnataka: Party.BJP
                },
                {
                    OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
                    PartyWorkingForKarnataka: Party.CONGRESS
                }
            ]
        },
    })

    const pie:Pie = {
        bjp: bjp.length,
        congress: congress.length,
        fence: onTheFence.length
    }
    return pie;
}

async function getReligionPies(partId:number|undefined) {
    //By Religion
    if(partId === 0) {
        partId = undefined
    }
    const bjpReligion = await prisma.voter.groupBy({
        by: ['religion'],
        _count: true,
        where: {
            partId: partId,
            OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
            PartyWorkingForKarnataka: Party.BJP
        },
    })

    const congressReligion = await prisma.voter.groupBy({
        by: ['religion'],
        _count: true,
        where: {
            partId: partId,
            OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
            PartyWorkingForKarnataka: Party.CONGRESS
        },
    })

    const onTheFenceReligion = await prisma.voter.groupBy({
        by: ['religion'],
        _count: true,
        where: {
            partId: partId,
            OR: [
                {
                    OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
                    PartyWorkingForKarnataka: Party.BJP
                },
                {
                    OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
                    PartyWorkingForKarnataka: Party.CONGRESS
                }
            ]
        },
    })


    const religionPie:ReligionPie = {
        OTHER: {
            bjp: 0,
            congress: 0,
            fence: 0
        },
        HINDU: {
            bjp: 0,
            congress: 0,
            fence: 0
        },
        MUSLIM: {
            bjp: 0,
            congress: 0,
            fence: 0
        },
        CHRISTIAN: {
            bjp: 0,
            congress: 0,
            fence: 0
        }
    }
    bjpReligion.forEach((religion) => {
        const key = religion.religion
        if(key) {
            religionPie[key].bjp = religion._count;
        }
    });
    congressReligion.forEach((religion) => {
        const key = religion.religion
        if(key) {
            religionPie[key].congress = religion._count;
        }
    });
    onTheFenceReligion.forEach((religion) => {
        const key = religion.religion
        if(key) {
            religionPie[key].fence = religion._count;
        }
    });

    return religionPie;
}

// async function getEducationPies() {
//     //By Education
//     const bjpEducation = await prisma.voter.groupBy({
//         by: ['education'],
//         _count: true,
//         where: {
//             OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
//             PartyWorkingForKarnataka: Party.BJP
//         },
//     })

//     const congressEducation = await prisma.voter.groupBy({
//         by: ['education'],
//         _count: true,
//         where: {
//             OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
//             PartyWorkingForKarnataka: Party.CONGRESS
//         },
//     })

//     const onTheFenceEducation = await prisma.voter.groupBy({
//         by: ['education'],
//         _count: true,
//         where: {
//             OR: [
//                 {
//                     OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
//                     PartyWorkingForKarnataka: Party.BJP
//                 },
//                 {
//                     OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
//                     PartyWorkingForKarnataka: Party.CONGRESS
//                 }
//             ]
//         },
//     })

//     const educationPie:EducationPie = {
//         ILLITERATE: {
//             bjp: 0,
//             congress: 0,
//             fence: 0
//         },
//         PRIMARY: {
//             bjp: 0,
//             congress: 0,
//             fence: 0
//         },
//         MIDDLE: {
//             bjp: 0,
//             congress: 0,
//             fence: 0
//         },
//         MATRICULATION: {
//             bjp: 0,
//             congress: 0,
//             fence: 0
//         },
//         POSTMATRICULATION: {
//             bjp: 0,
//             congress: 0,
//             fence: 0
//         },
//         GRADUATION: {
//             bjp: 0,
//             congress: 0,
//             fence: 0
//         },
//         POSTGRADUATION: {
//             bjp: 0,
//             congress: 0,
//             fence: 0
//         }
//     }

//     bjpEducation.forEach((education) => {
//         const key = education.education
//         if(key) {
//             educationPie[key].bjp = education._count;
//         }
//     });
//     congressEducation.forEach((education) => {
//         const key = education.education
//         if(key) {
//             educationPie[key].congress = education._count;
//         }
//     });
//     onTheFenceEducation.forEach((education) => {
//         const key = education.education
//         if(key) {
//             educationPie[key].fence = education._count;
//         }
//     });

//     return educationPie;
// }

// async function getPartPies() {
//     //By PartId
    
//     const bjpParts = await prisma.voter.groupBy({
//         by: ['partId'],
//         _count: true,
//         where: {
//             OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
//             PartyWorkingForKarnataka: Party.BJP
//         },
//     })

//     const congressParts = await prisma.voter.groupBy({
//         by: ['partId'],
//         _count: true,
//         where: {
//             OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
//             PartyWorkingForKarnataka: Party.CONGRESS
//         },
//     })

//     const onTheFenceParts = await prisma.voter.groupBy({
//         by: ['partId'],
//         _count: true,
//         where: {
//             OR: [
//                 {
//                     OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
//                     PartyWorkingForKarnataka: Party.BJP
//                 },
//                 {
//                     OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
//                     PartyWorkingForKarnataka: Party.CONGRESS
//                 }
//             ]
//         },
//     })

//     const partPie:PartPie = {}
//     bjpParts.forEach((part) => {
//         const key = part.partId
//         if(key) {
//             if(partPie[key]) {
//                 partPie[key].bjp = part._count;
//             } else {
//                 partPie[key] = {
//                     bjp: part._count,
//                     congress: 0,
//                     fence: 0
//                 }
//             }
//         }
//     });
//     congressParts.forEach((part) => {
//         const key = part.partId
//         if(key) {
//             if(partPie[key]) {
//                 partPie[key].congress = part._count;
//             } else {
//                 partPie[key] = {
//                     bjp: 0,
//                     congress: part._count,
//                     fence: 0
//                 }
//             }
//         }
//     });
//     onTheFenceParts.forEach((part) => {
//         const key = part.partId
//         if(key) {
//             if(partPie[key]) {
//                 partPie[key].fence = part._count;
//             } else {
//                 partPie[key] = {
//                     bjp: 0,
//                     congress: 0,
//                     fence: part._count
//                 }
//             }
//         }
//     });

//     return partPie;
// }

async function getCastePies(partId:number|undefined) {
    if(partId === 0) {
        partId = undefined
    }
    const kuruba = await getCastePie('Kuruba', partId);
    const lingayat = await getCastePie('Lingayat', partId)
    const vokkaliga = await getCastePie('Vokkaliga', partId);
    const sc = await getCastePie('SC', partId);

    const castePies:CastePie = {
        kuruba: kuruba,
        lingayat: lingayat,
        vokkaliga: vokkaliga,
        sc: sc,
    }
    return castePies;

}

async function getCastePie(caste: string, partId:number|undefined): Promise<Pie> {

    const bjp = await prisma.voter.findMany({
        where: {
            partId: partId,
            caste: {
                contains: caste
            },
            OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
            PartyWorkingForKarnataka: Party.BJP
        },
    })

    const congress = await prisma.voter.findMany({
        where: {
            partId: partId,
            caste: {
                contains: caste
            },
            OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
            PartyWorkingForKarnataka: Party.CONGRESS
        },
    })

    const onTheFence = await prisma.voter.findMany({
        where: {
            partId: partId,
            caste: {
                contains: caste
            },
            OR: [
                {
                    OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
                    PartyWorkingForKarnataka: Party.BJP
                },
                {
                    OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
                    PartyWorkingForKarnataka: Party.CONGRESS
                }
            ]
        },
    })

    const pie:Pie = {
        bjp: bjp.length,
        congress: congress.length,
        fence: onTheFence.length
    }
    return pie;

}

async function getVoterSpectrum(partId:number|undefined): Promise<{voterSpectrum: VoterSpectrum, swingVoters:Voter[]}> {

    if(partId === 0) {
        partId = undefined
    }
    const voters = await prisma.voter.findMany({
        where: {
            partId: partId,
            religion: {
                not: null
            } 
        }
    });
    const voterSpectrum:VoterSpectrum = {
        faithfulCongress: 0,
        almostCongress: 0,
        swingCongress: 0,
        leaningCongress: 0,
        center: 0,
        leaningBjp: 0,
        swingBjp: 0,
        almostBjp: 0,
        faithfulBjp: 0
    }

    const swingVoters:Voter[] = []
    voters.forEach((voter)=> {
        let score = 0;
        if(voter.religion === Religion.MUSLIM) {
            score = score - 1;
        }
        if(voter.caste?.includes('Kuruba')) {
            score = score + 1
        }
        if(voter.caste?.includes('Vokkaliga')) {
            score = score - 1
        }
        if(voter.PartyWorkingForKarnataka === Party.BJP) {
            score = score + 2
        }
        if(voter.PartyWorkingForKarnataka === Party.CONGRESS) {
            score = score - 2
        }
        if(voter.popularLeader === Candidate.MTBNAGARAJ) {
            score = score + 1
        }
        if(voter.popularLeader === Candidate.MTBRAJESH) {
            score = score + 2
        }
        if(voter.popularLeader === Candidate.SHARATHBACHEGOWDA) {
            score = score - 2
        }
        if(voter.popularLeader === Candidate.BACHEGOWDA) {
            score = score - 1
        }
        switch (score) {
            case -5:
            case -4:
                voterSpectrum.faithfulCongress += 1
                break;
            case -3:
                voterSpectrum.almostCongress += 1
                break
            case -2:
                voterSpectrum.swingCongress += 1
                swingVoters.push(voter);
                break;
            case -1:
                voterSpectrum.leaningCongress += 1
                swingVoters.push(voter);
                break;
            case 0:
                voterSpectrum.center += 1
                swingVoters.push(voter);
                break;
            case 1:
                voterSpectrum.leaningBjp += 1
                swingVoters.push(voter);
                break;
            case 2:
                voterSpectrum.swingBjp += 1
                swingVoters.push(voter);
                break;
            case 3:
                voterSpectrum.almostBjp += 1
                break;
            case 4:
            case 5:
                voterSpectrum.faithfulBjp += 1
                break;            
            default:
                break;
        }
    })
    return {
        voterSpectrum, 
        swingVoters
    };
}