// @ts-ignore <>
import { Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";
import { WorkerModel, WorkerModelType } from "../db/workers.ts";

const searchWorkerbyId = async (req: Request<{id:string}>, res: Response<WorkerModelType>) => {
  try{
    const id = req.params.id;

    const exist_worker = await WorkerModel.findById(id)

    if (!exist_worker){
        res.status(404).send("Worker not found!")
        return
    }

    res.status(200).send(exist_worker)

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

export default searchWorkerbyId;