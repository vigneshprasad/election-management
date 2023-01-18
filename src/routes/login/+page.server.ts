import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ locals }) => {
    if(locals.user) {
        console.log("LOGIN PAGE IS REDIRECTING");
        throw redirect(302, '/')
    }
}) satisfies PageServerLoad;
 
export const actions: Actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const access_token = data.get('access_token');
        if(access_token) {
            cookies.set('session', access_token.toString(), {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30,
            })
            throw redirect(302, '/');
        }
    }
};