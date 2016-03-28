"use strict";

const config = require('config');
const mathProducer = require('./math-producer');
const serverName = config.get('server.name');

function * idGenerator() {
    let id = 1;

    while(true) {
        yield id++;
    }
}

// A worker that only generates work for others, classic XD
class Worker {
    constructor(interval, callback) {
        this._interval = interval || 1000;
        this._callback = callback || function() {};
        this._running = false;
        this._idGenerator = idGenerator();
        this._nextId = () => this._idGenerator.next().value;
        this._timer = null;
    }

    start() {
        if( this._running ) {
            return;
        }

        this._timer = setInterval(() => {
            const problem = mathProducer();
            const task = {
                id: this._nextId(),
                producer: serverName,
                problem: problem
            };
            this._callback(task);
        }, this._interval);
        this._running = true;
    }

    stop() {
        if( !this._running ) {
            return;
        }

        clearInterval(this._timer);
        this._timer = null;
        this._running = false;
    }
}

module.exports = Worker;