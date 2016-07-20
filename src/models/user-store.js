import {User} from './user';
export class UserStore {
    users = [];

    constructor(api) {
        this.api = api;
    }

    fetch() {
        return this.api.getAllFriends().then(arr => {
            return this.users = arr.map(json => new User(json))
        })
    }
}