import {d, translator, Component, BaseModel} from "./utils";

class Api {
    fetch(method, params) {
        return new Promise((resolve, reject) =>
            vk.api.get.friends(method, params, (err, result) =>
                err ? reject(err) : resolve(result)));
    }

    friends(nickname) {
        this.fetch('friends', {nickname});
    }

    getAllFriends() {
        return this.fetch();
    }
}

const api = new Api();

class User extends BaseModel {
    id;
    firstName;
    lastName;

    constructor(json) {
        this.id = json.id;
        this.firstName = json.firstName;
        this.lastName = json.lastName;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }

    filterName(str) {
        const regExp = translator(str);
        return this.firstName.match(regExp) || this.lastName.match(regExp);
    }
}

class FriendsStore extends BaseModel {
    users = [];

    constructor(api) {
        this.api = api;
    }

    fetch() {
        return this.api.getAllFriends().then(arr => {
            return this.users = arr.map(json => new User(json))
        })
    }
}


class DialogModel {
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
        this.friendsStore = new FriendsStore(this.api);
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

class DialogView extends Component {
    constructor(dialogModel) {
        this.dialogModel = dialogModel;
        this.dialogModel.eventBus.subscribe('selectedUsers', this.onSelectedUsersChange);
    }

    onDestroy() {
        this.dialogModel.eventBus.unsubscribe('selectedUsers', this.onSelectedUsersChange);
    }

    onSelectedUsersChange = selectedUsers => {
        if (this.mount) {
            if (selectedUsers.length > 1) {
                this.actionsEl.classList.remove('hidden');
            } else {
                this.actionsEl.classList.add('hidden');
            }
            this.diffUsers(selectedUsers);
        }
    };

    diffUsers(selectedUsers) {
        const selectedUsersIds = selectedUsers.map(user => user.id);
        this.friendsEl.filter(friendComponent => selectedUsersIds.indexOf(friendComponent.user.id) === -1)
            .forEach(friendComponent => {
                friendComponent.destroy();
            });


        let j = 0;
        let beforeNode = this.friendsEl.length > 0 ? this.friendsEl[0].rootNode : null;
        for (let i = 0; i < selectedUsers.length; i++) {
            const user = selectedUsers[i];
            const friendComponent = this.friendsEl[j];
            if (this.friendsEl[j].user.id == user.id) {
                beforeNode = friendComponent.rootNode.nextSibling;
                j++;
            } else {
                const friendComponent = new DialogFriend(this.dialogModel, user);
                this.friendsEl.splice(j, 0, friendComponent);
                rootNode.insertBefore(friendComponent.render(), beforeNode);
            }
        }
        selectedUsers.filter(user => this.friendsEl.map(friendComponent => friendComponent.user))
    }


    onClose = () => {
        this.destroy();
    };

    onFilterInput = (event) => {
        this.filterClearEl.classList.add('hidden');
        this.filterLoaderEl.classList.remove('hidden');
        this.dialogModel.setFilterText(event.target.value).then(()=> {
            this.filterClearEl.classList.remove('hidden');
            this.filterLoaderEl.classList.add('hidden');
        })
    };

    onUserToggleSelect = () => {
        this.dialogModel.selectedUsers.toggleUser(this.user);
    };

    onFilterClear = () => {
        this.dialogModel.setFilterText('');
    };

    onSave = () => {
        this.saveButtonEl.setAttribute('disabled', '');
        this.saveButtonEl.classList.add('saving');
        this.dialogModel.save().then(()=> {
            this.saveButtonEl.removeAttribute('disabled');
            this.saveButtonEl.classList.remove('saving');
            this.destroy();
        })
    };

    render() {
        return (
            d('div.dialog-view', null,
                d('div.dialog-header', null,
                    'Создание беседы',
                    d('span.close', {events: {click: this.onClose}}, '×')
                ),
                d('div.dialog-filter', null,
                    d('input.dialog-input', {events: {input: this.onFilterInput}}),
                    this.filterClearEl = d('span.close.hidden', {events: {click: this.onFilterClear}}, '×'),
                    this.filterLoaderEl = d('span.loader.hidden')
                ),
                this.friendsEl = this.dialogModel.selectedUsers.map(user =>
                    new DialogFriend(this.dialogModel, user)
                ),
                this.actionsEl = d('div.actions.hidden', null,
                    this.saveButtonEl = d('button', {events: {change: this.onSave}}, 'Создать беседу'),
                )
            )
        );
    }
}


class DialogFriend extends Component {
    constructor(dialogModel, user) {
        this.dialogModel = dialogModel;
        this.user = user;
    }

    onToggleSelect = () => {
        this.dialogModel.selectedUsers.toggleUser(this.user);
    };

    render() {
        return (
            d('div.friend', null,
                d('div.avatar', {style: {backgroundImage: ''}}),
                d('div.name', null, this.user.getFullName()),
                d('input.checkbox', {events: {change: this.onToggleSelect}}, this.user.getFullName()),
            )
        );
    }
}
