import mongoose from "npm:mongoose@7.6.3";
import { Business } from "../types.ts";
import { WorkerModel } from "./workers.ts";
import { TaskModel } from "./tasks.ts";

const Schema = mongoose.Schema;

const businessSchema = new Schema(
  {
    name: { type: String, required: true },
    workers:  [{ type: Schema.Types.ObjectId, required: false, default: null }]
  },
  { timestamps: true }
);

businessSchema.path("name").validate(function(name: string){
  return (name.length > 0 && name.length <= 100)
})

businessSchema.path("workers").validate(function (workers:Array<mongoose.Schema.Types.ObjectId>) {
  if(workers){
      if(workers.length > 10){
          throw new Error('Business already have 10 workers!');
      }
  }
  return true;
})

businessSchema.post("findOneAndUpdate", async function (busi: BusinessModelType) {
  const business = await BusinessModel.findById(busi._id).exec();

  if (business && business.workers && business.workers.length < 10) {
      await WorkerModel.updateMany({_id:{$in: business.workers}}, {$set:{business: business._id}});
      return;
  }

  throw new Error('Business already have 10 workers');
});


businessSchema.post("findOneAndDelete", async function (business:BusinessModelType) {
  if(business && business.workers){
      try {
          await WorkerModel.updateMany({_id:{$in: business.workers}}, {$set:{business: null}, $pull:{tasks: {$exists: true}}});
          await TaskModel.deleteMany({ business: business._id });
      } catch (error) {
          console.error("Error while deleting workers", error);
      }
  }
})


export type BusinessModelType = mongoose.Document & Omit<Business, "id">;

export const BusinessModel = mongoose.model<Business>("Business", businessSchema);