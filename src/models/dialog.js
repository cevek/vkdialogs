import {UserStore} from './user-store';
import {EventBus} from '../lib/event-bus';

export class DialogModel {
    eventBus = new EventBus();
    filterText;
    friendsStore;
    allFriends = [];
    filteredUsers = [];
    selectedUsers = [];

    constructor(api) {
        this.api = api;
        this.friendsStore = new UserStore(api);
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
        this.filteredUsers = [];
        return this.friendsStore.fetch(this.filterText).then(users => {
            if (this._fetchFilterVersion == version) {
                this.filteredUsers = this.allFriends.filter(user => users.some(u => u.id == user.id));
                this.eventBus.fire('filteredUsers', this.filteredUsers);
            }
        });
    }

    fetch() {
        return this.friendsStore.fetch().then(users => {
            this.allFriends = users;
            this.filteredUsers = this.allFriends.slice();
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
