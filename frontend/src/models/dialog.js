import {EventEmitter} from "../lib/event-emitter";
import {User} from "./user";
import {uniqueArray, translit} from "../lib/utils";

export class DialogViewModel {
    eventBus = new EventEmitter();

    filterText;
    allUsers = [];
    filteredUsers = [];
    selectedUsers = [];

    constructor(api) {
        this.api = api;
    }

    _prevFetchedUsers = [];
    _prevFetchedQuery = '';
    _localFilteredUsers;

    setFilterText(text) {
        this.filterText = text;
        const lowerText = text.replace(/[^\wа-яё ]/ig, '').toLocaleLowerCase();
        const textVariations = uniqueArray([
            lowerText,
            translit.cyrLat(lowerText),
            translit.latCyrKeys(lowerText),
            translit.cyrLatKeys(lowerText),
            translit.cyrLat(translit.latCyrKeys(lowerText)),
            translit.latCyr(translit.cyrLatKeys(lowerText)),
        ]);
        this.filteredUsers = [];
        let users = this._localFilteredUsers = this.filterUsers(textVariations);
        // if prev query has current query append users from prev query
        if (this._prevFetchedQuery.indexOf(text) > -1) {
            users = users.concat(this._prevFetchedUsers);
        }
        this._setFilteredUsers(users);
        this.eventBus.fire('filteredUsers', this.filteredUsers);
        return text ? this.fetchFilterQuery(textVariations, text) : Promise.resolve();
    }

    // hack, because we cannot abort old promise
    _fetchFilterVersion = 0;

    fetchFilterQuery(textVariations, text) {
        const version = ++this._fetchFilterVersion;
        this.api.searchFriends(textVariations).then(users => {
            users = users.map(json => new User(json));
            if (this._fetchFilterVersion == version) {
                const usersFromServer = this.allUsers.filter(user => users.some(u => u.id == user.id));
                this._prevFetchedUsers = usersFromServer;
                this._prevFetchedQuery = text;
                this._setFilteredUsers(this._localFilteredUsers.concat(usersFromServer));
                this.eventBus.fire('loaded', this.filteredUsers);
            }
        })
    }

    _setFilteredUsers(users) {
        this.filteredUsers = users.slice();
        this.filteredUsers = uniqueArray(this.filteredUsers);
        this.eventBus.fire('filteredUsers', this.filteredUsers);
    }

    fetchUsers() {
        return this.api.getAllFriends().then(usersJson => {
            this.allUsers = usersJson.map(json => new User(json));
            this.allUsers.sort((a, b) => a.fullName < b.fullName ? -1 : 1);
            this.filteredUsers = this.allUsers.slice();
        });
    }

    save() {
        return new Promise((resolve, reject)=> {
            setTimeout(()=> {
                alert('Ура! Беседа создана!');
                resolve();
            }, 1000);
        });
    }

    filterUsers(textVariations) {
        if (textVariations.length == 0) {
            return this.allUsers.slice();
        }
        const regExp = new RegExp(`(^|\\b)(${textVariations.join('|')})`, 'i');

        return this.allUsers.filter(user => regExp.test(user.fullName));
    }

    userIsSelected(user) {
        return this.selectedUsers.indexOf(user) > -1;
    }

    toggleUser(user) {
        const pos = this.selectedUsers.indexOf(user);
        if (pos > -1) {
            this.selectedUsers.splice(pos, 1);
        }
        else {
            this.selectedUsers.push(user);
        }
        this.eventBus.fire('selectedUsers', this.selectedUsers);
    }
}
