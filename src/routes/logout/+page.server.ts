import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
    throw redirect(302, '/login')
}

export const actions: Actions = {
    default({ cookies }) {
        // delete the cookie
        cookies.set('session', '', {
            path: '/',
            expires: new Date(0)
        })

        console.log("cookies", cookies.get('session'));

        //redirect the user
        throw redirect(302, '/login')
    }
}