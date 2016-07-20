import {User} from './user';
export class UserStore {
    constructor(api) {
        this.api = api;
    }

    fetch() {
        return this.api.getAllFriends().then(arr => {
            return arr.map(json => new User(json))
        })
    }
}