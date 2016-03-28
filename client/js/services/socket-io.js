"use strict";

socketIO.$inject = ['socketFactory'];
function socketIO(socketFactory) {
    return socketFactory();
}

module.exports = socketIO;