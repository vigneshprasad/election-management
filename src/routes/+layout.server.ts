import prisma from "$root/lib/prisma";
import type { LayoutServerLoad } from ".svelte-kit/types/src/routes/$types"

export const load: LayoutServerLoad = async ({ locals }) => {
    const userPermissions = await prisma.userPermissions.findUnique({
        where: {
            user: locals?.user?.name
        }
    })
    return {
        user: locals.user,
        isAdmin: userPermissions?.isAdmin
    }
}