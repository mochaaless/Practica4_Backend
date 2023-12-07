// @ts-ignore <>
import { _Request, Response } from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";
import { BusinessModel, BusinessModelType } from "../db/business.ts";

const getallBusiness = async (_req:Request, res: Response<Array<BusinessModelType>>) => {
  try{
    const business = await BusinessModel.find({})
    res.status(200).send(business)

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

export default getallBusiness;