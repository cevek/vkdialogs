import {EventEmitter} from "../lib/event-emitter";
import {User} from "./user";
import {uniqueArray, translit} from "../lib/utils";

export class DialogViewModel {
    eventBus = new EventEmitter();

    filterText;
    allUsers = [];
    usersMap = {};
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
        const lowerText = text.toLocaleLowerCase();
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
        return text ? this.fetchFilterQuery(textVariations, text) : Promise.resolve();
    }

    // hack, because we cannot abort old promise
    _fetchFilterVersion = 0;

    fetchFilterQuery(textVariations, text) {
        const version = ++this._fetchFilterVersion;
        this.api.searchFriends(textVariations).then(userIds => {
            if (this._fetchFilterVersion == version) {
                const usersFromServer = new Array(userIds.length);
                for (let i = 0; i < userIds.length; i++) {
                    const uid = userIds[i];
                    const user = this.usersMap[uid];
                    if (user) {
                        usersFromServer[i] = user;
                    } else {
                        throw new Error('User not found');
                    }
                }
                this._prevFetchedUsers = usersFromServer;
                this._prevFetchedQuery = text;
                this._setFilteredUsers(this._localFilteredUsers.concat(usersFromServer));
                this.eventBus.fire('loaded', this.filteredUsers);
            }
        })
    }

    _setFilteredUsers(users) {
        const newUsers = [];
        const usedUserIds = {};
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (!usedUserIds[user.id]) {
                newUsers.push(user);
                usedUserIds[user.id] = true;
            }
        }
        this.filteredUsers = newUsers;
        this.eventBus.fire('filteredUsers', this.filteredUsers);
    }

    fetchUsers() {
        return this.api.getAllFriends().then(usersJson => {
            this.allUsers = usersJson.map(json => {
                const user = new User(json);
                this.usersMap[user.id] = user;
                return user;
            });
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
        const regExp = new RegExp(` (${textVariations.map(v => v.replace(/([^\wа-яё ])/ig, '\\$1')).join('|')})`);
        const users = [];
        for (let i = 0; i < this.allUsers.length; i++) {
            const user = this.allUsers[i];
            if (regExp.test(user.searchStr)) {
                users.push(user)
            }
        }
        return users;
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
