//@ts-ignore //Para evitar que salga rojo lo del express
import {Request, Response} from "express";
import mongoose from "mongoose";

import { BusinessModel } from "../db/business.ts";

const deleteBusinessbyId = async(req:Request<{id:string}>, res:Response<string>) => {
    try{
        const id = req.params.id;

        const business = await BusinessModel.findByIdAndDelete(id).exec();

        if(!business){
            res.status(404).send("Business not found!");
            return;            
        }

        res.status(200).send("Business successfully deleted");
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

export default deleteBusinessbyId