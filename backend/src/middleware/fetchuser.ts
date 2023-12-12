import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";
import { RequestWithUser } from "../../config/types";

const jwt_secret : string = config.get("jwt_secret") as string;

const fetchuser = (req : RequestWithUser, res : Response, next : NextFunction) : void => {
    // extract the authtoken from header
    const token : string | undefined = req.header('auth-token');
    if(!token){
        res.status(401).json({error : "Invalid Credentials"});
    }
    else{
        try{
            // Get the user id from jwt token
            const payload = jwt.verify(token, jwt_secret) as JwtPayload; // Assuring always to send paylaod so as to receive the same
            req.user = payload.user;
            next();
        }
        catch(error){
            console.log(error);
            res.status(401).json({error : 'Invalid Credentials'});
        }
    }
}

export default fetchuser;