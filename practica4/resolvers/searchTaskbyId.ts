// @ts-ignore <>
import { Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";
import { TaskModel, TaskModelType } from "../db/tasks.ts";

const searchTaskbyId = async (req: Request<{id:string}>, res: Response<TaskModelType>) => {
  try{
    const id = req.params.id;

    const exist_task = await TaskModel.findById(id)

    if (!exist_task){
        res.status(404).send("Task not found!")
        return
    }

    res.status(200).send(exist_task)

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

export default searchTaskbyId;