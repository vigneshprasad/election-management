import prisma from "$root/lib/prisma";
import { Candidate, Category, EconomicStatus, Education, Gender, Party, Prisma, Relation, Religion, Symbol, YesNo, type Voter } from "@prisma/client";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ params, locals }) => {
    if(!locals.user) {
        throw redirect(302, '/login');
    }
    const voter = await prisma.voter.findUnique({
        where: {
            id: Number(params.id),
        }
    });

    if(!locals.user) {
        throw redirect(302, '/login');
    }
    const userPermissions = await prisma.userPermissions.findUnique({
        where: {
            user: locals?.user?.name
        }
    })

    let parts;
    if(userPermissions?.isAdmin) {
        parts = await prisma.part.findMany();
    } else {
        parts = await prisma.part.findMany({
            where: {
                users: {
                    some: {
                        userPermissions: {
                            user: locals?.user?.name
                        }
                    }
                }
            }
        });
    }
    
    if(!parts || !voter) {
        throw error(404, 'Not found');
    }

    const ids = parts.map(function(i) {
        return i.id;
    });

    if(voter && !ids.includes(voter?.partId)) {
        throw error(404, 'Not found');
    }
    
    return {
        voter: voter,
        parts: parts
    };

}) satisfies PageServerLoad;


export const actions:Actions = {
    edit: async ({ request }) => {
        const form = await request.formData();
        const voterId = Number(form.get('id'))
        const oldVoter = await prisma.voter.findUnique({
            where: {
                id: voterId
            }
        });
        const oldVoterData = JSON.parse(JSON.stringify(oldVoter))
        const newVoter = await prisma.voter.update({
            where: {
                id: voterId
            },
            data: {
                religion: Religion[form.get('religion') as keyof typeof Religion] || undefined,
                caste: String(form.get('caste')) !== "null" && String(form.get('caste')) || undefined,
                subcaste: String(form.get('subcaste')) !== "null" && String(form.get('subcaste')) || undefined,
                category: Category[form.get('category') as keyof typeof Category] || undefined,
                education: Education[form.get('education') as keyof typeof Education] || undefined,
                economicStatus: EconomicStatus[form.get('economicStatus') as keyof typeof EconomicStatus] || undefined,
                phone: String(form.get('phone')) !== "null" && String(form.get('phone')) || undefined,
                profession: String(form.get('profession')) !== "null" && String(form.get('profession')) || undefined,
                village: String(form.get('village')) !== "null" && String(form.get('village')) || undefined,
                familyMembers: Number(form.get('familyMembers')) || undefined,
                schemeAwareness: YesNo[form.get('schemeAwareness') as keyof typeof YesNo] || undefined,
                toiletConstruction: YesNo[form.get('toiletConstruction') as keyof typeof YesNo] || undefined,
                PMAwasYojanaHousing: YesNo[form.get('PMAwasYojanaHousing') as keyof typeof YesNo] || undefined,
                PMStreetVendorAndMudraLoan: YesNo[form.get('PMStreetVendorAndMudraLoan') as keyof typeof YesNo] || undefined,
                JalJeevanPipedWater: YesNo[form.get('JalJeevanPipedWater') as keyof typeof YesNo] || undefined,
                AyushmanHealthCard: YesNo[form.get('AyushmanHealthCard') as keyof typeof YesNo] || undefined,
                AvailServices: YesNo[form.get('AvailServices') as keyof typeof YesNo] || undefined,
                WhichPartyResponsibleForSchemes: Party[form.get('WhichPartyResponsibleForSchemes') as keyof typeof Party] || undefined,
                PartyWorkingForKarnataka: Party[form.get('PartyWorkingForKarnataka') as keyof typeof Party] || undefined,
                SymbolOfMTB: Symbol[form.get('SymbolOfMTB') as keyof typeof Symbol] || undefined,
                SymbolOfBachegowda: Symbol[form.get('SymbolOfBachegowda') as keyof typeof Symbol] || undefined,           
                popularLeader: Candidate[form.get('popularLeader') as keyof typeof Candidate] || undefined,     
            }
        })
        const newVoterData = JSON.parse(JSON.stringify(newVoter))

        console.log(form.get('accuracy'));
        console.log(form.get('altitude'));
        console.log(form.get('latitude'));
        console.log(form.get('longitude'));

        const location = await prisma.location.create({
            data: {
                accuracy: new Prisma.Decimal(String(form.get('accuracy'))),
                altitude: new Prisma.Decimal(String(form.get('altitude'))),
                latitude: new Prisma.Decimal(String(form.get('latitude'))),
                longitude: new Prisma.Decimal(String(form.get('longitude'))),
                timestamp: String(form.get('timestamp'))
            }
        })

        await prisma.voterEditLog.create({
            data: {
              voterId: voterId,
              user: String(form.get('user')),
              oldData: oldVoterData,
              newData: newVoterData,
              locationId: location.id
            },
        })

        return {};
    },

    verify: async ({ request }) => {
        const form = await request.formData();
        const voterId = Number(form.get('id'))
        const oldVoter = await prisma.voter.findUnique({
            where: {
                id: voterId
            }
        });
        const oldVoterData = JSON.parse(JSON.stringify(oldVoter))
        const newVoter = await prisma.voter.update({
            where: {
                id: voterId
            },
            data: {
                verifiedBy: String(form.get('user')),
                verifiedAt: new Date(),
            }
        })
        const newVoterData = JSON.parse(JSON.stringify(newVoter))

        const location = await prisma.location.create({
            data: {
                accuracy: new Prisma.Decimal(String(form.get('accuracy'))),
                altitude: new Prisma.Decimal(String(form.get('altitude'))),
                latitude: new Prisma.Decimal(String(form.get('latitude'))),
                longitude: new Prisma.Decimal(String(form.get('longitude'))),
                timestamp: String(form.get('timestamp'))
            }
        })
        
        await prisma.voterEditLog.create({
            data: {
              voterId: voterId,
              user: String(form.get('user')),
              oldData: oldVoterData,
              newData: newVoterData,
              locationId: location.id
            },
        })

        return {
            verifiedAt: newVoter.verifiedAt,
            verifiedBy: newVoter.verifiedBy
        };
    }
}