import express, { Request, Response } from "express";

import {
    saveProfile,
    SaveProfileParams
} from "./profile.js";
import {
    baseUrl,
    asyncHandler
} from "./net.js";


export function routes() {
    var router = express.Router();

    const runningSince = new Date();
    router.get( "/status", function( req: Request, res: Response ) {
        res.json({
            name:"Agentic Profile Test Service",
            version:[1,0,0], 
            started: runningSince,
            url:baseUrl(req) 
        }); 
    });

    router.post( "/agentic-profile", asyncHandler( async (req: Request, res: Response) => {
        const result = await saveProfile( req.body as SaveProfileParams );
        res.json( result );
    }));

    return router;
}
