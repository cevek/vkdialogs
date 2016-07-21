export class Api {
    constructor(config) {
        this.config = config;
        VK.init({apiId: config.appId});
    }

    auth() {
        // todo: opening new window needs same event loop stack after click, promises broke that
        return this.getLoginStatus().then(session => {
            if (!session) {
                return new Promise((resolve, reject)=> {
                    VK.Auth.login(response => {
                        response.session ? resolve(response.session) : reject(response)
                    }, this.config.scope);
                });
            }
            return session;
        }).then(session => {
            this.session = session;
            return session;
        });
    }

    getLoginStatus() {
        return new Promise((resolve, reject)=> {
            VK.Auth.getLoginStatus(response => resolve(response.session));
        });
    }


    call(method, params) {
        return new Promise((resolve, reject) => {
            VK.api(method, params, (r) => {
                r.response ? resolve(r.response) : reject(r)
            })
        });
    }

    searchFriends(q) {
        return this.call('friends.search', {q, fields: 'photo_100', count: 100});
    }

    getAllFriends() {
        return this.call('friends.get', {fields: 'photo_100', order: 'hints', limit: 100})
    }
}