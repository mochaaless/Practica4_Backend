import mongoose from "npm:mongoose@7.6.3";
import { Worker } from "../types.ts";
import { BusinessModel } from "./business.ts";
import { TaskModel } from "./tasks.ts";
const Schema = mongoose.Schema;

const workerSchema = new Schema(
  {
    name: { type: String, required: true, unique: true},
    tasks:  [{ type: Schema.Types.ObjectId, required: false, default: null }],
    business: { type: Schema.Types.ObjectId, required: false, default: null}
  },
  { timestamps: true }
);

workerSchema.path("name").validate(function(name: string){
  return (name.length > 0 && name.length <= 100)
})

workerSchema.path("business").validate(async function (_id: string) {
    if (_id == null){
        return true
    }
    const existBusiness = await BusinessModel.findOne({ _id });
    return !!existBusiness;
});

workerSchema.path("tasks").validate(function (tasks:Array<mongoose.Schema.Types.ObjectId>) {
    if(tasks){
        if(tasks.length > 10){
            throw new Error('Worker already have 10 tasks!');
        }
    }
    return true;
})

workerSchema.post("findOneAndDelete", async function (worker:WorkerModelType) {
    await TaskModel.deleteMany({worker: worker._id});
})

workerSchema.post("findOneAndUpdate", async function (lastWorker: WorkerModelType) {
    const newWorker = await WorkerModel.findById(lastWorker._id).exec();
    if (newWorker && !newWorker.business) {

        await BusinessModel.updateOne(
            { workers: newWorker._id },
            { $pull: { workers: newWorker._id } }
        );
        await TaskModel.deleteMany({ worker: newWorker._id });
    }
});

workerSchema.post("findOneAndDelete", async function (worker:WorkerModelType) {
    await TaskModel.deleteMany({worker: worker._id});
})


export type WorkerModelType = mongoose.Document & Omit<Worker, "id">;

export const WorkerModel = mongoose.model<Worker>("Worker", workerSchema);