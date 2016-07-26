export class Api {
    constructor(config) {
        this.config = config;
    }

    toUrlSearchQuery(obj, prefix) {
        const str = [];
        for (const p in obj) {
            if (obj.hasOwnProperty(p)) {
                const k = prefix;
                const v = obj[p];
                str.push(typeof v == "object"
                    ? this.toUrlSearchQuery(v, p)
                    : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
                );
            }
        }
        return str.join('&');
    }


    fetch(method, queries) {
        return fetch(`/api/${method}/?${this.toUrlSearchQuery(queries)}`).then(response => response.json());
    }

    searchFriends(query) {
        return this.fetch('users', {query});
    }

    getAllFriends() {
        return this.fetch('users')
    }
}