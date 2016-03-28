"use strict";

DashboardController.$inject = ['taskService'];
function DashboardController(taskService) {
    var vm = this;

    // This only works because taskService doesn't assign over its tasks reference when updating its contents
    vm.tasks = taskService.tasks;
}

module.exports = DashboardController;