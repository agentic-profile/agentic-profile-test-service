import {
    S3Client,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import {
	AgenticProfile,
	DID
} from "@agentic-profile/common";

const s3 = new S3Client({region: 'us-west-2'});

type MediaOptions = {
    metadata?: any,
    contentType: string
}

type S3Params = {
    Bucket: string,
    Key: string,
    ContentType: string,
    Body: Buffer,
    Metadata: any
}

export interface SaveProfileParams {
    profile: AgenticProfile
    b64uPublicKey: string
}

export async function saveProfile({ profile, b64uPublicKey }: SaveProfileParams ) {
	// create DID
	const date = new Date().toISOString().split("T")[0];
	const did = `did:web:test.agenticprofile.ai:${date}:${b64uPublicKey}`;

    profile.id = did;

    const path = `${date}/${b64uPublicKey}/did.json`;
	const json = Buffer.from( JSON.stringify( profile, null, 4), "utf-8" );
	await saveMedia( path, json, { contentType: "application/json" } );

    return { profile };
}

async function saveMedia( path: string, media: Buffer, options: MediaOptions ) {
    let params = { Bucket:process.env.S3_BUCKET, Key:path, Body:media } as S3Params;
    if( options.metadata ) params.Metadata = options.metadata;
    if( options.contentType ) params.ContentType = options.contentType;

    const command = new PutObjectCommand( params );
    const result = await s3.send( command );
    console.log( 'saveMedia', path, media.length );
}