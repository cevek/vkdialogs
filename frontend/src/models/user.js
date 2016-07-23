import {hasText, translitToCyr, translitToLat} from "../lib/utils";

export class User {
    id;
    firstName;
    lastName;

    constructor(json) {
        this.id = json.id;
        this.firstName = json.first_name;
        this.lastName = json.last_name;
        this.photo = json.photo;
        const fullName = (this.firstName + ' ' + this.lastName).toLocaleLowerCase();
        this.fullName = fullName;
        this.searchVariations = [
            fullName,
            translitToCyr(fullName),
            translitToLat(fullName),
        ];
    }

    hasText(str) {
        return hasText(this.searchVariations, str);
    }
}