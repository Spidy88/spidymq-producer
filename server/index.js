"use strict";

const path = require('path');
const connect = require('connect');
const serveStatic = require('serve-static');
const ejs = require('ejs');
const dashboardRoute = require('./routes/dashboard');

// TODO: Use dependency injection
function createApp(mq) {
    const app = connect();
    const staticFiles = serveStatic(path.join(__dirname, '../webapp.build'));

    app.use(staticFiles);

    // Attach the message queue router
    app.use(mq.router);

    // If file isn't found in static files, serve up the dashboard
    app.use(dashboardRoute);

    return app;
}

module.exports = createApp;