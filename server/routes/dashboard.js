"use strict";

const path = require('path');
const ejs = require('ejs');
const config = require('config');
const indexPath = path.join(__dirname, '../views/index.ejs');
const producerName = config.get('server.name');
const urlPattern = /^\/(producer(\/.*)?)?$/;

function dashboardRoute(req, res, next) {
    // If the url is root, or starts with /producer, its a SPA route, send the index.ejs
    // Otherwise call next and let another route handle it
    // Note this isn't an issue with apps like angular that prefix routes with /#/
    if( !urlPattern.test(req.url) ) {
        return next();
    }

    ejs.renderFile(indexPath, { producerName: producerName }, function(err, contents) {
        if( err ) {
            console.error(err);
            res.statusCode = 500;
            res.end();
            return;
        }

        res.statusCode = 200;
        res.end(contents);
    });
}

module.exports = dashboardRoute;