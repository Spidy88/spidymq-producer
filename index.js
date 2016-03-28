"use strict";

const http = require('http');
const config = require('config');
const socketIO = require('socket.io');
const winston = require('winston');
const SpidyMQ = require('spidymq');
const createApp = require('./server');
const Worker = require('./worker');

const serverName = config.get('server.name');
const serverUrl = config.get('server.url');
const serverPort = config.get('server.port');
const spidyMQUrl = config.get('spidyMQ.url');
const spidyMQPort = config.get('spidyMQ.port');

const mq = SpidyMQ(`${spidyMQUrl}:${spidyMQPort}`, { serverUrl: `${serverUrl}:${serverPort}` });
mq.connect();

// TODO: Clean up with promises, rxjs, or async
mq.createChannel('problems', { type: 'round-robin' }, function(err) {
    if( err ) {
        winston.error('Failed to create problems queue');
        return;
    }

    mq.createChannel('solutions', { type: 'broadcast' }, function(err) {
        if( err ) {
            winston.error('Failed to create solutions queue');
            return;
        }

        worker.start();

        mq.subscribeChannel('solutions', function(task) {
            // Only emit solutions for problems we generated
            if( task.content.producer === serverName ) {
                io.emit('solution', task.content);
            }
        });
    });
});

//TODO: Support clustering
const app = createApp(mq);
const server = http.createServer(app);
const io = socketIO(server);

// Calculate interval to achieve problems per second
const generationSpeed = (1 / config.get('producer.problemsPerSecond')) * 1000;

// Create a worker that generates a math problem. The problem is emitted to the client and placed on a message queue.
const worker = new Worker(generationSpeed, function(task) {
    io.emit('problem', task);
    mq.publishMessage('problems', task);
});

server.listen(serverPort, function() {
    winston.info('Server ready');
});