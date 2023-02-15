import prisma from "$root/lib/prisma";
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals }) => {
    let isAdmin = false;
    if(locals.user) {
        const userPermissions = await prisma.userPermissions.findUnique({
            where: {
                user: locals?.user?.name
            }
        })
        isAdmin = userPermissions?.isAdmin ? userPermissions?.isAdmin : false
    }
    return {
        user: locals.user,
        isAdmin: isAdmin
    }
}