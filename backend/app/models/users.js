"use strict";

module.exports = class Users {
    constructor(app) {
        this.app = app;
    }

    *findAll() {
        return yield this.app.models.query('SELECT id, first_name, last_name, photo FROM users');
    }

    *findByQuery(query) {
        const queries = (Array.isArray(query) ? query : [query]).slice(0, 10).map(q => q.substr(0, 30));
        const searchCols = ['first_name', 'last_name', 'nickname'];
        const likeSql = [];
        const likeValues = [];
        for (let i = 0; i < searchCols.length; i++) {
            var col = searchCols[i];
            for (let j = 0; j < queries.length; j++) {
                likeSql.push(`${col} LIKE ?`);
                likeValues.push(`%${queries[j]}%`);
            }
        }
        return yield this.app.models.query(`SELECT id, first_name, last_name, photo FROM users WHERE ${likeSql.join(' OR ')}`, likeValues);
    }
};
