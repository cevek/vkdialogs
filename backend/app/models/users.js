"use strict";

module.exports = class Users {
    constructor(app) {
        this.app = app;
    }

    //todo: make unlimit
    *findAll() {
        return yield this.app.models.query('SELECT id, first_name, last_name, photo FROM users LIMIT 1000');
    }

    *findByQuery(query) {
        const value = (Array.isArray(query) ? query : [query]).slice(0, 10)
            .map(q =>
                q.substr(0, 30).replace(/^[\wа-яё ]]/ig, '') + '*').join(' ');

        return yield this.app.models.query(`SELECT id, first_name, last_name, photo FROM users WHERE 
                MATCH(first_name, last_name, nickname) AGAINST (? IN BOOLEAN MODE) LIMIT 100`, value);
    }
};
