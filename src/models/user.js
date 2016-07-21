import {translator, traslitLatKeys, hasText} from '../lib/utils';

export class User {
    id;
    firstName;
    lastName;

    constructor(json) {
        this.id = json.uid;
        this.firstName = json.first_name;
        this.lastName = json.last_name;
        this.photo = json.photo_100;
        this.fullName = this.firstName + ' ' + this.lastName;
    }

    filterName(str) {
        return hasText(this.fullName, str);
    }
}