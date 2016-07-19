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
            this.users = arr.map(json => new User(json))
        })
    }
}


class DialogModel {
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
    }

    fetch() {
        this.friendsStore = new FriendsStore();
        return this.friendsStore.fetch();
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
    }

    components = {
        header: new DialogHeader(this.dialogModel),
        filter: new DialogFilter(this.dialogModel),
        friends: this.dialogModel.selectedUsers.map(user =>
            new DialogFriend(this.dialogModel, user)),
        actions: new DialogActions(this.dialogModel)
    };

    render() {
        return (
            d('div.dialog-view', null,
                this.components.header,
                this.components.filter,
                this.components.friends,
                this.components.actions
            )
        );
    }
}

class DialogHeader extends Component {
    constructor(dialogModel) {
        this.dialogModel = dialogModel;
    }

    onClose = () => {
        this.dialogModel.close();
    };

    render() {
        return (
            d('div.dialog-header', null,
                'Создание беседы',
                d('span.close', {events: {click: this.onClose}}, '×')
            )
        );
    }
}

class DialogFilter extends Component {

    closeEl;
    loaderEl;

    constructor(dialogModel) {
        this.dialogModel = dialogModel;
        this.subscribe(dialogModel, 'filterLoadingState', this.onLoadingStateChange);
    }

    onLoadingStateChange = (state) => {
        if (this.mount) {
            if (state) {
                this.closeEl.classList.remove('hidden');
                this.loaderEl.classList.add('hidden');
            } else {
                this.closeEl.classList.add('hidden');
                this.loaderEl.classList.remove('hidden');
            }
        }
    };


    onInput = (event) => {
        this.dialogModel.setFilterText(event.target.value);
    };

    onClear = () => {
        this.dialogModel.setFilterText('');
    };

    render() {
        return (
            d('div.dialog-filter', null,
                d('input.dialog-input', {events: {input: this.onInput}}),
                d('span.close.hidden', {events: {click: this.onClear}}, '×'),
                d('span.loader.hidden')
            )
        );
    }
}

class DialogActions extends Component {
    rootEl;
    buttonEl;

    constructor(dialogModel) {
        this.dialogModel = dialogModel;
        this.subscribe(dialogModel, 'selectedUsers', this.onSelectedUsersChange);
    }

    onSelectedUsersChange = selectedUsers => {
        if (this.mount) {
            if (selectedUsers.length > 1) {
                this.rootEl.classList.remove('hidden');
            } else {
                this.rootEl.classList.add('hidden');
            }
        }
    };

    onSubmit() {
        this.buttonEl.setAttribute('disabled', '');
        this.buttonEl.classList.add('saving');
        this.dialogModel.save().then(()=> {
            this.buttonEl.removeAttribute('disabled');
            this.buttonEl.classList.remove('saving');
        })
    }

    render() {
        return (
            this.rootEl = d('div.actions.hidden', null,
                this.buttonEl = d('button', {events: {change: this.onSubmit}}, 'Создать беседу'),
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