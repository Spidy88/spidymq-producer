"use strict";

var DashboardController = require('./dashboard/dashboard-controller');
var socketIO = require('./services/socket-io');
var taskService = require('./services/task-service');

angular.module('spidymq.producer', ['ui.router', 'btford.socket-io'])
    .config(config)
    .controller('DashboardController', DashboardController)
    .factory('socketIO', socketIO)
    .service('taskService', taskService);

config.$inject = [ '$locationProvider', '$stateProvider', '$urlRouterProvider', '$compileProvider' ];
function config( $locationProvider, $stateProvider, $urlRouterProvider, $compileProvider ) {
    $locationProvider.html5Mode({
        requireBase: false
    });

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('dashboard', {
            url: '/',
            templateUrl: 'templates/dashboard/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'ctrl'
        });

    // TODO: Set based on build environment
    $compileProvider.debugInfoEnabled(false);
}