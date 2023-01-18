import type { Handle } from '@sveltejs/kit';
import config from './auth_config';

export const handle: Handle = async({ event, resolve}) => {
    const session = event.cookies.get('session');
    if(!session) {
        // there is no session so load page normally
        return await resolve(event);

    }
    const response = await fetch(
        `https://${config.domain}/userinfo`, 
        {
            headers: {
                'Authorization' : `Bearer ${session}`,
                'Content-Type' : 'application/json'
            }
        }
    )
    if (response.status == 200) { 
        const data = await response.json();
        if(data) {
            event.locals.user = { ...data };
        }
    }
    return await resolve(event);
}