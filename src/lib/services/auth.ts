// src/authService.js

import { createAuth0Client, Auth0Client } from "@auth0/auth0-spa-js";
import config from "../../auth_config";

async function createClient() {
    const auth0Client = await createAuth0Client({
        domain: config.domain,
        clientId: config.clientId,
    });

    return auth0Client;
}

async function loginWithPopup(client:Auth0Client) {
    try {
        await client.loginWithPopup();
        // const accessToken = await client.getTokenSilently();
    } catch (e) {
        console.error(e);
    } 
}

function logout(client:Auth0Client) {
    return client.logout();
}

const auth = {
    createClient,
    loginWithPopup,
    logout
};

export default auth;