// @ts-ignore <>
import { _Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";
import { WorkerModel, WorkerModelType } from "../db/workers.ts";

const getallWorkers = async (_req:Request, res: Response<Array<WorkerModelType>>) => {
  try{
    const workers = await WorkerModel.find({})
    res.status(200).send(workers)

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

export default getallWorkers;