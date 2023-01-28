import prisma from '$root/lib/prisma'
import { Candidate, Education, Party, Religion } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit'; 
import type { PageServerLoad } from '../$types';

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

    const parts = await prisma.part.findMany();
    // const partId = Number(url.searchParams.get('partId'))
    const religionPie = await getReligionPies();
    const educationPie = await getEducationPies();
        
    return {
        parts, religionPie, educationPie
    };
}) satisfies PageServerLoad;


async function getReligionPies() {
    //By Religion

    const bjpReligion = await prisma.voter.groupBy({
        by: ['religion'],
        _count: true,
        where: {
            OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
            PartyWorkingForKarnataka: Party.BJP
        },
    })

    const congressReligion = await prisma.voter.groupBy({
        by: ['religion'],
        _count: true,
        where: {
            OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
            PartyWorkingForKarnataka: Party.CONGRESS
        },
    })

    const onTheFenceReligion = await prisma.voter.groupBy({
        by: ['religion'],
        _count: true,
        where: {
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

    type ReligionPie = { [K in Religion]: { bjp:number, congress: number, fence:number}; }

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

async function getEducationPies() {
    //By Education
    const bjpEducation = await prisma.voter.groupBy({
        by: ['education'],
        _count: true,
        where: {
            OR: [ { popularLeader: Candidate.MTBNAGARAJ}, { popularLeader: Candidate.MTBRAJESH}],
            PartyWorkingForKarnataka: Party.BJP
        },
    })

    const congressEducation = await prisma.voter.groupBy({
        by: ['education'],
        _count: true,
        where: {
            OR: [ { popularLeader: Candidate.SHARATHBACHEGOWDA}, { popularLeader: Candidate.BACHEGOWDA}],
            PartyWorkingForKarnataka: Party.CONGRESS
        },
    })

    const onTheFenceEducation = await prisma.voter.groupBy({
        by: ['education'],
        _count: true,
        where: {
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

    type EducationPie = { [K in Education]: { bjp:number, congress: number, fence:number}; }

    const educationPie:EducationPie = {
        ILLITERATE: {
            bjp: 0,
            congress: 0,
            fence: 0
        },
        PRIMARY: {
            bjp: 0,
            congress: 0,
            fence: 0
        },
        MIDDLE: {
            bjp: 0,
            congress: 0,
            fence: 0
        },
        MATRICULATION: {
            bjp: 0,
            congress: 0,
            fence: 0
        },
        POSTMATRICULATION: {
            bjp: 0,
            congress: 0,
            fence: 0
        },
        GRADUATION: {
            bjp: 0,
            congress: 0,
            fence: 0
        },
        POSTGRADUATION: {
            bjp: 0,
            congress: 0,
            fence: 0
        }
    }

    bjpEducation.forEach((education) => {
        const key = education.education
        if(key) {
            educationPie[key].bjp = education._count;
        }
    });
    congressEducation.forEach((education) => {
        const key = education.education
        if(key) {
            educationPie[key].congress = education._count;
        }
    });
    onTheFenceEducation.forEach((education) => {
        const key = education.education
        if(key) {
            educationPie[key].fence = education._count;
        }
    });

    return educationPie;
}