import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";

import createBusiness from "./resolvers/createBusiness.ts";
import createWorker from "./resolvers/createWorker.ts";
import createTask from "./resolvers/createTasks.ts";
import searchWorkerbyId from "./resolvers/searchWorkerbyId.ts";
import searchBusinessbyId from "./resolvers/searchBusinessbyId.ts";
import searchTaskbyId from "./resolvers/searchTaskbyId.ts";
import hireWorker from "./resolvers/hireWorker.ts";
import fireWorker from "./resolvers/fireWorker.ts";
import getallBusiness from "./resolvers/getallBusiness.ts";
import getallWorkers from "./resolvers/getallWorkers.ts";
import getallTasks from "./resolvers/getallTasks.ts";
import deleteBusinessbyId from "./resolvers/deleteBusinessbyID.ts";
import deleteWorkerbyId from "./resolvers/deleteWorkerbyID.ts";
import deleteTaskbyId from "./resolvers/deleteTaskbyId.ts";

import { changeStatus } from "./resolvers/changeStatus.ts";

import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts"
const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());

app
.post("/business", createBusiness)
.post("/worker", createWorker)
.post("/task", createTask)

.put("/business/:id/hire/:workerId", hireWorker)
.put("/business/:id/fire/:workerId", fireWorker)

.get("/worker/:id", searchWorkerbyId)
.get("/business/:id", searchBusinessbyId)
.get("/task/:id", searchTaskbyId)

.get("/business", getallBusiness)
.get("/worker", getallWorkers)
.get("/task", getallTasks)

.put("/task/:id/:status", changeStatus)

.delete("/business/:id", deleteBusinessbyId)
.delete("/worker/:id", deleteWorkerbyId)
.delete("/task/:id", deleteTaskbyId)

app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });