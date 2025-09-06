"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tasks_json_1 = __importDefault(require("./tasks.json"));
var fs = __importStar(require("fs"));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["todo"] = 0] = "todo";
    TaskStatus[TaskStatus["in_progress"] = 1] = "in_progress";
    TaskStatus[TaskStatus["done"] = 2] = "done";
})(TaskStatus || (TaskStatus = {}));
var TaskManager = /** @class */ (function () {
    function TaskManager() {
        this.tasksList = tasks_json_1.default.map(function (t) { return ({
            id: t.id, // number → string
            description: t.description,
            status: t.status, // string → enum
            createdAt: new Date(t.createdAt), // string → Date
            updatedAt: new Date(t.updatedAt),
        }); });
    }
    TaskManager.prototype.addTasks = function (description) {
        var lastId = this.tasksList[this.tasksList.length - 1].id;
        var createdAt = new Date();
        var updatedAt = createdAt;
        this.tasksList.push({
            id: lastId + 1,
            description: description,
            status: TaskStatus.todo,
            createdAt: createdAt,
            updatedAt: updatedAt,
        });
        console.log("Task added with ID: ".concat(lastId + 1));
    };
    TaskManager.prototype.deleteTask = function (id) {
        var index = this.tasksList.findIndex(function (task) { return (task.id == id); });
        if (index == undefined) {
            console.log("No task with ID = ".concat(id));
        }
        else {
            this.tasksList.splice(index, 1);
        }
    };
    TaskManager.prototype.showTasks = function () {
        this.tasksList.forEach(function (task) {
            console.log("".concat(task.id, ".- ").concat(task.description, " | status: ").concat(TaskStatus[task.status], "  "));
        });
    };
    TaskManager.prototype.showTasksFilter = function (filter) {
        var _this = this;
        var filtered_task = this.tasksList.filter(function (task) { return task.status == filter; });
        filtered_task.forEach(function (task) {
            console.log("".concat(task.id, ".- ").concat(task.description));
            console.log("    created at: ".concat(_this.dateToString(task.createdAt), " - update at: ").concat(_this.dateToString(task.updatedAt)));
        });
    };
    TaskManager.prototype.dateToString = function (date) {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    TaskManager.prototype.updateTask = function (id, description) {
        var index = this.tasksList.findIndex(function (task) { return task.id == id; });
        if (index == undefined) {
            console.log("No task with ID = ".concat(id));
        }
        else {
            console.log(index, id);
            this.tasksList[index].description = description;
        }
    };
    TaskManager.prototype.markInProgress = function (id) {
        var index = this.tasksList.findIndex(function (task) { return (task.id == id); });
        if (index == undefined) {
            console.log("No task with ID = ".concat(id));
        }
        else {
            this.tasksList[index].status = TaskStatus.in_progress;
        }
    };
    TaskManager.prototype.markDone = function (id) {
        var index = this.tasksList.findIndex(function (task) { return (task.id == id); });
        if (index == undefined) {
            console.log("No task with ID = ".concat(id));
        }
        else {
            this.tasksList[index].status = TaskStatus.done;
        }
    };
    TaskManager.prototype.saveList = function () {
        var filePath = "tasks.json";
        var jsonString = JSON.stringify(this.tasksList);
        fs.writeFile(filePath, jsonString, function (err) {
            if (err) {
                console.error("Error writing JSON file:", err);
                return;
            }
            //console.log("JSON file written successfully!");
        });
    };
    return TaskManager;
}());
var option = process.argv.slice(2);
var taskManager = new TaskManager();
if (option.includes("list")) {
    if (process.argv.length <= 3) {
        taskManager.showTasks();
    }
    else {
        var filter = process.argv[3];
        var status_1 = TaskStatus[filter];
        taskManager.showTasksFilter(status_1);
    }
}
if (option.includes("update")) {
    var id = process.argv[3];
    var description = process.argv[4];
    taskManager.updateTask(Number(id), description);
    taskManager.saveList();
}
if (option.includes("mark-in-progress")) {
    var id = process.argv[3];
    taskManager.markInProgress(Number(id));
    taskManager.saveList();
}
if (option.includes("mark-done")) {
    var id = process.argv[3];
    taskManager.markDone(Number(id));
    taskManager.saveList();
}
if (option.includes("add")) {
    var description = process.argv[3];
    taskManager.addTasks(description);
    taskManager.saveList();
}
if (option.includes("delete")) {
    var id = process.argv[3];
    taskManager.deleteTask(Number(id));
    taskManager.saveList();
}
