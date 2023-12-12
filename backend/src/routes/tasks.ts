import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { RequestWithUser } from "../../config/types";
import fetchuser from "../middleware/fetchuser";
import Task from "../db/models/Task";

const router = Router();

// Route - 1: Get all tasks : GET '/api/task/fetchalltasks' Login Required
router.get('/fetchalltasks', fetchuser, async (req : RequestWithUser, res : Response, next : NextFunction) : Promise<Response> => {
    try{
        const tasks = await Task.find({user : req.user?.id});
        if(!tasks){
            return res.status(404).json({tasks});
        }
        return res.status(200).json({tasks});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error : 'Internal Server Error'});
    }
});

// Route - 2: Add a new task : POST '/api/task/addtask' Login Required
router.post('/addtask', fetchuser,  [
        // validate the content of req.body
        body('task', 'Task must be at least 3 characters long').isLength({min : 3})
    ], async (req : RequestWithUser, res : Response, next : NextFunction) : Promise<Response> => {
    // check for any error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }
    try{
        const {task} = req.body;
        const newTask = new Task({
            task, user : req.user?.id
        });
        const savedTask = await newTask.save();
        return res.status(200).json({savedTask});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error : 'Internal Server Error'});
    }
});

// Route - 3: Update a task : PUT '/api/task/updatetask' Login Required
router.put('/updatetask/:id', fetchuser,  [
        // Validate the content of req.body
        body('task', 'Task must be at least 3 characters long').isLength({min : 3})
    ], async (req : RequestWithUser, res : Response, next : NextFunction) : Promise<Response> => {
    // Check for any error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }
    try{
        const {task} = req.body;
        // Create a new task object
        const newTask = new Task({
            task
        });
        // Find the task to be updated
        const targetTask = await Task.findById(req.params.id);

        // Check for the existence of the task
        if(!targetTask){
            return res.status(404).json({error : 'Task not found'});
        }
        // Check whether user is trying to update his own task or other's
        if(targetTask.user.toString() !== req.user?.id){
            return res.status(401).json({error : 'Access Denied'});
        }
        // Update the task
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {$set : {task: newTask.task}}, {new : true});
        return res.status(200).json({updatedTask});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error : 'Internal Server Error'});
    }
});

// Route - 4: Delete a task : delete '/api/task/deletetask' Login Required
router.delete('/deletetask/:id', fetchuser, async (req : RequestWithUser, res : Response, next : NextFunction) : Promise<Response> => {
    try{
        // Find the task to be deleted
        const targetTask = await Task.findById(req.params.id);

        // Check for the existence of the task
        if(!targetTask){
            return res.status(404).json({error : 'Task not found'});
        }
        // Check whether user is trying to update his own task or other's
        if(targetTask.user.toString() !== req.user?.id){
            return res.status(401).json({error : 'Access Denied'});
        }
        // Delete the task
        await Task.findByIdAndDelete(req.params.id);
        return res.status(200).json({success : "Task Deleted"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error : 'Internal Server Error'});
    }
});


export default router;