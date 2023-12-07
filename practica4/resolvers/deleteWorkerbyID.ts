//@ts-ignore //Para evitar que salga rojo lo del express
import { Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";

import { WorkerModel } from "../db/workers.ts";

const deleteWorkerbyId = async(req:Request<{id:string}>, res:Response<string>) => {
    try{
        const id = req.params.id;

        const worker = await WorkerModel.findByIdAndDelete(id).exec();

        if(!worker){
            res.status(404).send("Worker not found!");
            return;            
        }

        res.status(200).send("Worker successfully deleted");
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

export default deleteWorkerbyId