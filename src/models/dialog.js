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
        let promise;
        this.filteredUsers = this.filterUsers();
        this.eventBus.fire('filteredUsers', this.filteredUsers);
        return text ? this.fetchFilter() : Promise.resolve();
    }

    fetchFilter() {
        this.filteredUsers = [];
        return this.friendsStore.fetch(this.filterText).then(users => {
            this.filteredUsers = users;
            this.eventBus.fire('filteredUsers', this.filteredUsers);
        });
    }

    fetch() {
        return this.friendsStore.fetch().then(users => {
            this.allFriends = users;
        });
    }

    filterUsers() {
        if (!this.filterText) {
            return this.allFriends.slice();
        }
        return this.allFriends.filter(user =>
            user.filterName(this.filterText));
    }

    toggleUser(user) {
        const pos = this.selectedUsers.indexOf(user);
        if (pos > -1) {
            this.selectedUsers.splice(pos, 1);
        }
        else {
            this.selectedUsers.push(user);
        }
    }
}
