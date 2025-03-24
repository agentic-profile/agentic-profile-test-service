import axios from "axios";

import {
    createEdDsaJwk
} from "@agentic-profile/auth";
import { webDidToUrl } from "@agentic-profile/common";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFile, mkdir } from "fs/promises";

import { logAxiosResult } from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateKeys( name ) {
    const keypair = await createEdDsaJwk();
    const shared = {
        name,
        ...keypair,
        privateKey: undefined,
        created: new Date(),
        expires: new Date('2030-1-1')
    };
    return { keypair, shared };
}

(async ()=>{

    const { publicJwk, b64uPublicKey, privateJwk } = await createEdDsaJwk();
    const verificationMethod = {
        id: "#agent-key-0",
        type: "JsonWebKey2020",
        publicKeyJwk: publicJwk
    };

    const profile = {
        "@context": [
            "https://www.w3.org/ns/did/v1",
            "https://w3id.org/security/suites/jws-2020/v1",
            "https://iamagentic.org/ns/agentic-profile/v1"
        ],
        //id: did,
        name: "Dave",
        verificationMethod: [],
        service:[
            {
                id: "#agentic-chat",
                type: "AgenticChat",
                serviceEndpoint: "https://localhost:3003/users/7/agent-chats",
                capabilityInvocation: [
                    verificationMethod
                ]
            }
        ]
    };

    try {
        const result = await axios.post(
            "http://localhost:3003/agentic-profile",
            { profile, b64uPublicKey }
        );
        logAxiosResult( result );
        const data = result.data ?? result.response?.data;

        const savedProfile = data.profile;
        const profileJSON = JSON.stringify( savedProfile, null, 4 );
        const did = savedProfile.id;

        const keyringJSON = JSON.stringify( privateJwk, null, 4 );
        console.log(`Agentic Profile saved

Shhhh! Keyring for testing: ${keyringJSON}

Agentic Profile: ${profileJSON}

DID: ${did}
HTTPS URL: ${webDidToUrl(did)} 
`);
    } catch (error) {
        console.error("ERROR: Failed to create profile:", error);
    }
})();
