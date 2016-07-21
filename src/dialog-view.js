import {Component, List, d} from './lib/dom';
import './dialog.less';

export class DialogView extends Component {
    model;
    friendListCmp;
    filterInputNode;
    filterClearNode;
    filterLoaderNode;
    actionsNode;
    saveButtonNode;

    constructor(model) {
        super();
        this.model = model;
        this.model.eventBus.subscribe('filteredUsers', this.onFilteredUsersChange);
        this.model.eventBus.subscribe('selectedUsers', this.onSelectedUsersChange);
    }

    onDestroy() {
        this.model.eventBus.unsubscribe('filteredUsers', this.onFilteredUsersChange);
        this.model.eventBus.unsubscribe('selectedUsers', this.onSelectedUsersChange);
    }

    onFilteredUsersChange = filteredUsers => {
        if (this.mount) {
            this.friendListCmp.update(filteredUsers);
        }
    };

    onSelectedUsersChange = selectedUsers => {
        if (this.mount) {
            if (selectedUsers.length > 1) {
                this.actionsNode.classList.remove('hidden');
            } else {
                this.actionsNode.classList.add('hidden');
            }
        }
    };

    onClose = () => {
        this.destroy();
    };

    onFilterInput = (event) => {
        var text = event.target.value;
        this.filterClearNode.classList.add('hidden');
        this.filterLoaderNode.classList.remove('hidden');
        this.model.setFilterText(text).then(()=> {
            this.filterLoaderNode.classList.add('hidden');
            if (event.target.value) {
                this.filterClearNode.classList.remove('hidden');
            }
        })
    };

    onFilterClear = () => {
        this.model.setFilterText('');
        this.filterInputNode.value = '';
        this.filterClearNode.classList.add('hidden');
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
            this.model.filteredUsers,
            user => user.id,
            user => new DialogFriend(this.model, user));

        return (
            d('div.dialog-view', null,
                d('div.dialog-header', null,
                    'Создание беседы',
                    d('span.close', {events: {click: this.onClose}}, '×')
                ),
                d('div.dialog-filter', null,
                    this.filterInputNode = d('input.dialog-input', {type: 'text', events: {input: this.onFilterInput}}),
                    this.filterLoaderNode = d('span.spinner.hidden'),
                    this.filterClearNode = d('span.clear.hidden', {events: {click: this.onFilterClear}}, '×')
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
        super();
        this.model = model;
        this.user = user;
    }

    onToggleSelect = () => {
        this.model.toggleUser(this.user);
    };

    render() {
        return (
            d('div.friend', null,
                d('div.photo', {style: {backgroundImage: `url(${this.user.photo})`}}),
                d('div.name', null, this.user.getFullName()),
                d('input.checkbox', {
                    type: 'checkbox',
                    checked: this.model.userIsSelected(this.user),
                    events: {change: this.onToggleSelect}
                }, this.user.getFullName()),
            )
        );
    }
}
