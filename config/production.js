"use strict";

module.exports = {
    server: {
        name: process.env.SERVER_NAME,
        url: process.env.SERVER_URL,
        port: process.env.PORT
    },

    spidyMQ: {
        url: process.env.SPIDYMQ_URL,
        port: process.env.SPIDYMQ_PORT
    },

    producer: {
        problemsPerSecond: +process.env.PROBLEMS_PER_SECOND
    }
};