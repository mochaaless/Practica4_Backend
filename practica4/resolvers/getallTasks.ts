// @ts-ignore <>
import { _Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";
import { TaskModel, TaskModelType } from "../db/tasks.ts";

const getallTasks = async (_req:Request, res: Response<Array<TaskModelType>>) => {
  try{
    const tasks = await TaskModel.find({})
    res.status(200).send(tasks)

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
};

export default getallTasks;