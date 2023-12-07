export type Business ={
    id: string
    name: string
    workers: Array<Omit<Worker, "business" | "task">>
}

export type Worker = {
    id: string
    name: string
    tasks: Array<Omit<Task, "business" | "worker">>
    business: Omit<Business, "workers">
}

export type Task = {
    id: string
    name: string
    status: Status
    business: Omit<Business, "workers">
    worker: Omit<Worker, "task" | "business">
}

export enum Status {
    ToDo = "ToDo", 
    InProgress = "InProgress",
    InTest = "InTest",
    Closed = "Closed"
}
