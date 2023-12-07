// @ts-ignore <>
import { Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";

import { TaskModel, TaskModelType } from "../db/tasks.ts";

const createTask = async(req:Request<TaskModelType>, res:Response<string>) => {
    try{
        const {name, status, business, worker} = req.body;
        const task = new TaskModel({name, status, business, worker})
        await task.save()

        res.status(200).send("Task successfully created!");
    }catch(error){
        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.keys(error.errors).map(
                (key) => error.errors[key].message
            );
            res.status(400).send("Validation error: " + validationErrors.join(", "))
        } else {
            res.status(500).send(error.message)
        }
    }
}

export default createTask