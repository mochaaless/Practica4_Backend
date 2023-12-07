// @ts-ignore <>
import { Request, Response } from "npm:express@4.18.2";
import { WorkerModel, WorkerModelType } from "../db/workers.ts";
import mongoose from "npm:mongoose@7.6.3";

const createWorker = async (req: Request<WorkerModelType>, res: Response<string>) => {
  try {
    const {name} = req.body;
    
    const newBusiness = new WorkerModel({name});
    await newBusiness.save();

    res.status(200).send("Worker sucessfully created!");
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

export default createWorker;