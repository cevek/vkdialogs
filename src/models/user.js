import {translator} from '../lib/utils';

export class User {
    id;
    firstName;
    lastName;

    constructor(json) {
        this.id = json.uid;
        this.firstName = json.first_name;
        this.lastName = json.last_name;
        this.photo = json.photo_100;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }

    filterName(str) {
        const regExp = translator(str);
        return this.firstName.match(regExp) || this.lastName.match(regExp);
    }
}