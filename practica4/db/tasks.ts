import mongoose from "npm:mongoose@7.6.3";
import { Task, Status } from "../types.ts";
import { BusinessModel } from "./business.ts";
import { WorkerModel } from "./workers.ts";
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    name: { type: String, required: true, unique: true},
    status:  { type: String, required: true},
    business: { type: Schema.Types.ObjectId, required: true},
    worker: { type: Schema.Types.ObjectId, required: true}
  },
  { timestamps: true }
);

taskSchema.path("name").validate(function(name: string){
  return (name.length > 0 && name.length <= 100)
})

taskSchema.path("business").validate(async function (_id: string) {
    const existBusiness = await BusinessModel.findOne({ _id });
    return !!existBusiness;
});

taskSchema.path("worker").validate(async function (_id: string) {
    const existWorker = await WorkerModel.findOne({ _id });
    return !!existWorker;
});

taskSchema.post("save", async function (task:TaskModelType) {
    await WorkerModel.findByIdAndUpdate(task.worker, {$push: {tasks: task._id}});
})

taskSchema.pre("findOneAndUpdate", async function (this: any, next) {
  const status = this.getUpdate().status;
  if(status === Status.Closed){
      await this.model.findOneAndDelete({_id: this.getQuery()._id});
      throw new Error('La tarea se ha borrado debido a su nuevo estado Closed');
  }
  next();
})

taskSchema.post("findOneAndDelete", async function (task:TaskModelType) {
  await WorkerModel.updateMany({tasks: task._id}, {$pull: {tasks: task._id}});
})

  
export type TaskModelType = mongoose.Document & Omit<Task, "id">;

export const TaskModel = mongoose.model<Task>("Task", taskSchema);