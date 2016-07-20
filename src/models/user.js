import {translator} from '../lib/utils';

export class User {
    id;
    firstName;
    lastName;

    constructor(json) {
        this.id = json.id;
        this.firstName = json.firstName;
        this.lastName = json.lastName;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }

    filterName(str) {
        const regExp = translator(str);
        return this.firstName.match(regExp) || this.lastName.match(regExp);
    }
}