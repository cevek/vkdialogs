import {translit} from "../lib/utils";

export class User {
    id;
    firstName;
    lastName;

    constructor(json) {
        this.id = json.id;
        this.firstName = json.first_name;
        this.lastName = json.last_name;
        this.photo = json.photo;
        this.fullName = this.firstName + ' ' + this.lastName;
    }
}