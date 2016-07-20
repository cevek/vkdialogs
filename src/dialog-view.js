import {Component, List, d} from './lib/dom';

export class DialogView extends Component {
    model;
    friendListCmp;
    filterClearNode;
    filterLoaderNode;
    actionsNode;
    saveButtonNode;

    constructor(model) {
        this.model = model;
        this.model.eventBus.subscribe('selectedUsers', this.onSelectedUsersChange);
    }

    onDestroy() {
        this.model.eventBus.unsubscribe('selectedUsers', this.onSelectedUsersChange);
    }

    onSelectedUsersChange = selectedUsers => {
        if (this.mount) {
            if (selectedUsers.length > 1) {
                this.actionsNode.classList.remove('hidden');
            } else {
                this.actionsNode.classList.add('hidden');
            }
            this.friendListCmp.update(selectedUsers);
        }
    };

    onClose = () => {
        this.destroy();
    };

    onFilterInput = (event) => {
        this.filterClearNode.classList.add('hidden');
        this.filterLoaderNode.classList.remove('hidden');
        this.model.setFilterText(event.target.value).then(()=> {
            this.filterClearNode.classList.remove('hidden');
            this.filterLoaderNode.classList.add('hidden');
        })
    };

    onFilterClear = () => {
        this.model.setFilterText('');
    };

    onSave = () => {
        this.saveButtonNode.setAttribute('disabled', '');
        this.saveButtonNode.classList.add('saving');
        this.model.save().then(()=> {
            this.saveButtonNode.removeAttribute('disabled');
            this.saveButtonNode.classList.remove('saving');
            this.destroy();
        })
    };


    render() {
        this.friendListCmp = new List({class: 'friend-list'},
            this.model.selectedUsers,
            user => user.id,
            user => new DialogFriend(this.model, user));

        return (
            d('div.dialog-view', null,
                d('div.dialog-header', null,
                    'Создание беседы',
                    d('span.close', {events: {click: this.onClose}}, '×')
                ),
                d('div.dialog-filter', null,
                    d('input.dialog-input', {events: {input: this.onFilterInput}}),
                    this.filterClearNode = d('span.close.hidden', {events: {click: this.onFilterClear}}, '×'),
                    this.filterLoaderNode = d('span.loader.hidden')
                ),
                this.friendListCmp,
                this.actionsNode = d('div.actions.hidden', null,
                    this.saveButtonNode = d('button', {events: {change: this.onSave}}, 'Создать беседу'),
                )
            )
        );
    }
}

class DialogFriend extends Component {
    constructor(model, user) {
        this.model = model;
        this.user = user;
    }

    onToggleSelect = () => {
        this.model.selectedUsers.toggleUser(this.user);
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
