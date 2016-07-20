export class Api {
    constructor(apiConfig) {
        this.apiConfig = apiConfig;
    }
    
    fetch(method, params) {
        return new Promise((resolve, reject) =>
            vk.api.get.friends(method, params, (err, result) =>
                err ? reject(err) : resolve(result)));
    }

    friends(nickname) {
        this.fetch('friends', {nickname});
    }

    getAllFriends() {
        return this.fetch();
    }
}