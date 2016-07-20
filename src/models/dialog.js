import {UserStore} from './user-store';
import {EventBus} from '../lib/event-bus';
export class DialogModel {
    eventBus = new EventBus();
    filterText;
    friendsStore;
    filteredUsers = [];
    selectedUsers = [];

    constructor(api) {
        this.api = api;
    }

    setFilterText(text) {
        this.filterText = text;
        this.filteredUsers = this.filterUsers();
        this.eventBus.fire('selectedUsers');
        return this.fetch();
    }

    fetch() {
        if (!this.filterText) {
            return Promise.resolve();
        }
        this.friendsStore = new UserStore(this.api);
        return this.friendsStore.fetch().then(users => {
            this.selectedUsers = this.selectedUsers.concat(users);
            this.eventBus.fire('selectedUsers');
        });
    }

    filterUsers() {
        return this.friendsStore.users.filter(user =>
            user.filterName(this.filterText));
    }

    toggleUser(user) {
        const pos = this.users.indexOf(user);
        if (pos > -1) {
            this.users.splice(pos, 1);
        }
        else {
            this.users.push(user);
        }
    }
}
