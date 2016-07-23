export class Api {
    constructor(config) {
        this.config = config;
    }

    toUrlSearchQuery(obj) {
        if (!obj) {
            return '';
        }
        const keys = Object.keys(obj);
        return keys.length ? '?' + keys.map(key => `${key}=${encodeURIComponent(obj[key])}`).join('&') : '';
    }


    fetch(method, queries) {
        return fetch(`/api/${method}/${this.toUrlSearchQuery(queries)}`).then(response => response.json());
    }

    searchFriends(query) {
        return this.fetch('users', {query});
    }

    getAllFriends() {
        return this.fetch('users')
    }
}