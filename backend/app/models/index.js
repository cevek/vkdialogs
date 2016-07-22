"use strict";

const mysql = require('mysql');

module.exports = function (app) {
    const pool = mysql.createPool(app.config.db);
    const Users = require('./users');
    return {
        query: function (query, params) {
            return new Promise((resolve, reject) => {
                pool.query(query, params, (err, result) => err ? reject(err) : resolve(result));
            });
        },
        users: new Users(app),
    };
};
