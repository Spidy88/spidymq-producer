"use strict";

taskService.$inject = ['socketIO'];
function taskService(socketIO) {
    this.tasks = {};

    socketIO.on('problem', upsertTask.bind(this));
    socketIO.on('solution', upsertTask.bind(this));

    function upsertTask(task) {
        this.tasks[task.id] = task;
    }
}

module.exports = taskService;