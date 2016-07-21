import {EventBus} from '../lib/event-bus';
import {User} from './user';
import {uniqueArray} from '../lib/utils';

export class DialogModel {
    eventBus = new EventBus();
    filterText;
    allFriends = [];
    filteredUsers = [];
    selectedUsers = [];

    constructor(api) {
        this.api = api;
    }

    setFilterText(text) {
        this.filterText = text;
        this.filteredUsers = this.filterUsers();
        this.eventBus.fire('filteredUsers', this.filteredUsers);
        return text ? this.fetchFilter() : Promise.resolve();
    }

    // hack, because we cannot abort old promise
    _fetchFilterVersion = 0;

    fetchFilter() {
        var version = ++this._fetchFilterVersion;
        return this.api.searchFriends(this.filterText).then(users => {
            users = users.map(json => new User(json));
            if (this._fetchFilterVersion == version) {
                const usersFromServer = this.allFriends.filter(user => users.some(u => u.id == user.id));
                this.filteredUsers = this.filteredUsers.concat(usersFromServer);
                this.filteredUsers = uniqueArray(this.filteredUsers);
                this.eventBus.fire('filteredUsers', this.filteredUsers);
            }
        }).catch(err=>console.error(err)); // too many requests error
    }

    fetch() {
        return this.api.getAllFriends().then(usersJson => {
            this.allFriends = usersJson.map(json => new User(json));
            this.allFriends.sort((a, b) => a.fullName < b.fullName ? -1 : 1);
            this.filteredUsers = this.allFriends.slice();
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
            return this.allFriends.slice();
        }
        return this.allFriends.filter(user =>
            user.filterName(this.filterText));
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
