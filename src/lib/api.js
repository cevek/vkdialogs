export class Api {
    constructor(appId) {
        this.appId = appId;
        VK.init({apiId: appId});
    }

    auth() {
        return this.getLoginStatus().then(session => {
            if (!session) {
                return new Promise((resolve, reject)=> {
                    VK.Auth.login(response => {
                        response.session ? resolve(response.session) : reject(response)
                    }, 2);
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
                console.log(r);
                r.response ? resolve(r.response) : reject(r)
            })
        });
    }

    searchFriends(q) {
        return this.call('friends.search', {q, fields: 'photo_100', count: 100});
    }

    getAllFriends() {
        return this.call('friends.get', {fields: 'photo_100', order: 'hints'})
    }
}