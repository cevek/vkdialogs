import {EventEmitter} from '../lib/event-emitter';
import {User} from './user';
import {uniqueArray} from '../lib/utils';

export class DialogViewModel {
    eventBus = new EventEmitter();

    filterText;
    allUsers = [];
    filteredUsers = [];
    selectedUsers = [];

    constructor(api) {
        this.api = api;
    }

    setFilterText(text) {
        this.filterText = text;
        this.filteredUsers = this.filterUsers();
        this.eventBus.fire('filteredUsers', this.filteredUsers);
        return text ? this.fetchFilterQuery() : Promise.resolve();
    }

    // hack, because we cannot abort old promise
    _fetchFilterVersion = 0;

    fetchFilterQuery() {
        const version = ++this._fetchFilterVersion;
        return this.api.searchFriends(this.filterText).then(users => {
            users = users.map(json => new User(json));
            if (this._fetchFilterVersion == version) {
                const usersFromServer = this.allUsers.filter(user => users.some(u => u.id == user.id));
                this.filteredUsers = this.filteredUsers.concat(usersFromServer);
                this.filteredUsers = uniqueArray(this.filteredUsers);
                this.eventBus.fire('filteredUsers', this.filteredUsers);
            }
        }).catch(err=>console.error(err)); // too many requests error
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

    filterUsers() {
        if (!this.filterText) {
            return this.allUsers.slice();
        }
        return this.allUsers.filter(user =>
            user.hasText(this.filterText));
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
