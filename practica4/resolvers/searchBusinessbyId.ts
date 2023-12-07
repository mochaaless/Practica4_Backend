// @ts-ignore <>
import { Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";
import { BusinessModel, BusinessModelType } from "../db/business.ts";

const searchBusinessbyId = async (req: Request<{id:string}>, res: Response<BusinessModelType>) => {
  try{
    const id = req.params.id;

    const exist_business = await BusinessModel.findById(id)

    if (!exist_business){
        res.status(404).send("Business not found!")
        return
    }

    res.status(200).send(exist_business)

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

export default searchBusinessbyId;