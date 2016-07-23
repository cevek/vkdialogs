"use strict";

const mysql = require('mysql');

module.exports = function (app) {
    const pool = mysql.createPool(app.config.db);
    const Users = require('./users');
    const models = {
        query: function (query, params) {
            return new Promise((resolve, reject) => {
                pool.query(query, params, (err, result) => err ? reject(err) : resolve(result));
            });
        },
        users: new Users(app),
    };
    models.query("SET NAMES 'utf8'");
    return models;
};
