import tasks from "./tasks.json";
import * as fs from "fs";

enum TaskStatus {
  todo,
  in_progress,
  done,
}

interface Task {
  id: number;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

class TaskManager {
  tasksList: Task[];
  constructor() {
    this.tasksList = tasks.map((t) => ({
      id: t.id, // number → string
      description: t.description,
      status: t.status as unknown as TaskStatus, // string → enum
      createdAt: new Date(t.createdAt), // string → Date
      updatedAt: new Date(t.updatedAt),
    }));
  }

  public addTasks(description: string): void {
    const lastId = this.tasksList[this.tasksList.length - 1].id;
    const createdAt = new Date();
    const updatedAt = createdAt;
    this.tasksList.push({
      id: lastId + 1,
      description: description,
      status: TaskStatus.todo,
      createdAt: createdAt,
      updatedAt: updatedAt,
    });
    console.log(`Task added with ID: ${lastId + 1}`);
  }

  public deleteTask(id: number): void {
    let index = this.tasksList.findIndex((task) => (task.id == id));
    if (index == undefined) {
      console.log(`No task with ID = ${id}`);
    } else {
      this.tasksList.splice(index, 1);
    }
  }

  public showTasks(): void {
    this.tasksList.forEach((task) => {
      console.log(
        `${task.id}.- ${task.description} | status: ${TaskStatus[task.status]}  `
      );
    });
  }

  public showTasksFilter(filter: TaskStatus): void {
    const filtered_task = this.tasksList.filter(
      (task) => task.status == filter
    );

    filtered_task.forEach((task) => {
      console.log(`${task.id}.- ${task.description}`);
      console.log(
        `    created at: ${this.dateToString(
          task.createdAt
        )} - update at: ${this.dateToString(task.updatedAt)}`
      );
    });
  }

  public dateToString(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  public updateTask(id: number, description: string): void {
    let index = this.tasksList.findIndex(task => task.id == id);
    if (index == undefined) {
      console.log(`No task with ID = ${id}`);
    } else {
      console.log(index, id);
      this.tasksList[index].description = description;
    }
  }

  public markInProgress(id: number): void {
    let index = this.tasksList.findIndex((task) => (task.id == id));
    if (index == undefined) {
      console.log(`No task with ID = ${id}`);
    } else {
      this.tasksList[index].status = TaskStatus.in_progress;
    }
  }

  public markDone(id: number): void {
    let index = this.tasksList.findIndex((task) => (task.id == id));
    if (index == undefined) {
      console.log(`No task with ID = ${id}`);
    } else {
      this.tasksList[index].status = TaskStatus.done;
    }
  }

  public saveList(): void {
    const filePath: string = "tasks.json";
    const jsonString: string = JSON.stringify(this.tasksList);
    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        return;
      }
      //console.log("JSON file written successfully!");
    });
  }
}

const option = process.argv.slice(2);

const taskManager: TaskManager = new TaskManager();
if (option.includes("list")) {
  if (process.argv.length <= 3) {
    taskManager.showTasks();
  } else {
    const filter = process.argv[3];
    const status = TaskStatus[filter as keyof typeof TaskStatus];
    taskManager.showTasksFilter(status);
  }
}

if (option.includes("update")) {
  const id = process.argv[3];
  const description = process.argv[4];
  taskManager.updateTask(Number(id), description);
  taskManager.saveList()
}
if (option.includes("mark-in-progress")) {
  const id = process.argv[3];
  taskManager.markInProgress(Number(id));
  taskManager.saveList()
}
if (option.includes("mark-done")) {
  const id = process.argv[3];
  taskManager.markDone(Number(id));
  taskManager.saveList()
}
if (option.includes("add")) {
  const description = process.argv[3];
  taskManager.addTasks(description);
  taskManager.saveList()
}
if (option.includes("delete")) {
  const id = process.argv[3];
  taskManager.deleteTask(Number(id))
  taskManager.saveList()
}