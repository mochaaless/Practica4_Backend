// @ts-ignore <>
import { Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";
import { WorkerModel } from "../db/workers.ts";
import {BusinessModel } from "../db/business.ts";

const hireWorker = async (req: Request<{id: string, workerId: string}>, res: Response<string>) => {
  try{
    const id = req.params.id;
    const workerId = req.params.workerId;

    const exist_business = await BusinessModel.findById(id)
    if (!exist_business){
        res.status(404).send("Business not found!")
        return
    }
    const exist_worker = await WorkerModel.findById(workerId)
    if (!exist_worker){
        res.status(404).send("Worker not found!")
        return
    }

    if (exist_worker?.business != null){
        res.status(400).send("Worker already working in a business!")
        return
    }

    await BusinessModel.findOneAndUpdate({_id : id}, {$push: {workers: workerId}}, {runValidators: true}).exec()

    res.status(200).send("Worker hired successfully!")

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

export default hireWorker;