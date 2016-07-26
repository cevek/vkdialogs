"use strict";

module.exports = class Users {
    constructor(app) {
        this.app = app;
    }

    *findAll() {
        return yield this.app.models.query('SELECT id, first_name, last_name, photo FROM users');
    }

    *findByQuery(query) {
        const value = (Array.isArray(query) ? query : [query]).slice(0, 10)
            .map(q => {
                const result = q.substr(0, 30).replace(/[^\wа-яё ._\-]/ig, '').trim();
                return result ? result + '*' : '';
            }).join(' ').trim();

        const results = value
            ? yield this.app.models.query(`SELECT id FROM users WHERE  MATCH(first_name, last_name, nickname) AGAINST (? IN BOOLEAN MODE)`, value)
            : [];

        return results.map(user => user.id);
    }
};
