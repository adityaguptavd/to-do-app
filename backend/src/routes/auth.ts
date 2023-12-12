import { Router, Request, Response } from "express";
import User from "../db/models/User";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "config";

const jwt_secret : string = config.get("jwt_secret") as string;

const router = Router();

// Route - 1 : Create a user using : POST "/api/auth/login" - No login required
router.post('/login', [
    // validate the content of req.body
    body('name', 'Name must contain at least 3  characters').isLength({min : 3})
], async (req : Request, res : Response) : Promise<Response> => {
    try{
        // check for any error
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }
        else{
            // creating user's document
            const newUser = new User({
                name : req.body.name
            });
            // saving user document in database
            await newUser.save();

            // signing token before sending it to the user
            const data = {
                user : {
                    id : newUser.id
                }
            };
            const authToken : string = jwt.sign(data, jwt_secret);
            // send the authtoken to the user
            return res.status(200).json({authToken});
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error : 'Internal Server Error'});
    }
});

export default router;