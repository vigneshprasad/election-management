import prisma from '$root/lib/prisma'
import { error, redirect } from '@sveltejs/kit'; 
import type { PageServerLoad } from '../$types';

export const load = (async ({ locals, url }) => {
    if(!locals.user) {
        throw redirect(302, '/login');
    }
    const parts = await prisma.part.findMany({
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
    console.log("PARTS", parts);
    
    if(!parts) {
        throw error(404, 'Not found');
    }

    const partIds = parts.map(part => part.id);
    const partId = Number(url.searchParams.get('partId'))
    const page = Number(url.searchParams.get('page'))
    const search = url.searchParams.get('search') || undefined;

    let data;
    
    if(partId) {
        if(!(partIds.includes(partId))) {
            throw error(404, 'Not found');
        }
        data = await prisma.voter.findMany({
            skip: page * 100,
            take: 100,
            where: {
                partId: partId,            
                name: {
                    contains: search,
                }
            }
        });
    } else {
        data = await prisma.voter.findMany({
            skip: page * 100,
            take: 100,
            where: {
                name: {
                    contains: search
                }
            }
        });
    }

    if(!data) {
        throw error(404, 'Not found');
    }
    const voters = data.map((voter) => {
        return {
            id: voter.id,
            name: voter.name,
            gender: voter.gender,
            age: voter.age,
            relationName: voter.relationName,
            relationType: voter.relationType,
            partId: voter.partId
        }
    })
        
    return {
        voters: voters,
        parts: parts
    }
}) satisfies PageServerLoad;
