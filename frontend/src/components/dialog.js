import {Component, List, d} from '../lib/dom';
import './dialog.less';

export class DialogView extends Component {
    model;
    selectedUsersCmp;
    friendListCmp;
    filterInputNode;
    filterClearNode;
    filterLoaderNode;
    actionsNode;
    saveButtonNode;

    placeholder = 'Введите имя или фамилию';

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
            this.filterInputNode.placeholder = selectedUsers.length == 0 ? this.placeholder : '';
            this.filterInputNode.setAttribute('fullsize', selectedUsers.length == 0);
            this.selectedUsersCmp.update(selectedUsers);
            this.friendListCmp.getItems().forEach(item => item.view.update());
            this.filterInputNode.focus();
            this.onFilterClear();
        }
    };

    onClose = () => {
        this.destroy();
    };

    onFilterInput = (event) => {
        const text = event.target.value;
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
        })
    };

    render() {
        this.friendListCmp = new List({
            props: {class: 'dialog__friend-list'},
            array: this.model.filteredUsers,
            key: user => user.id,
            view: user => new DialogFriend(this.model, user)
        });

        this.selectedUsersCmp = new List({
            props: {class: 'dialog__selected-users'},
            array: this.model.selectedUsers,
            key: user => user.id,
            view: user => new DialogUserItem(this.model, user)
        });

        return (
            d('div.dialog', null,
                d('div.dialog__header', null,
                    'Создание беседы',
                    d('span.clear.dialog__close', {title: "Закрыть", events: {click: this.onClose}})
                ),
                d('div.dialog__filter', null,
                    this.selectedUsersCmp,
                    this.filterInputNode = d('input.dialog__input', {
                        type: 'text',
                        autocomplete: 'off',
                        spellcheck: false,
                        placeholder: this.placeholder,
                        fullsize: true,
                        events: {input: this.onFilterInput}
                    }),
                    this.filterLoaderNode = d('span.dialog__spinner.dialog__filter-icon.hidden', null),
                    this.filterClearNode = d('span.clear.dialog__clear.dialog__filter-icon.hidden', {events: {click: this.onFilterClear}})
                ),
                this.friendListCmp,
                this.actionsNode = d('div.dialog__actions.hidden', null,
                    d('input.dialog__name', {placeholder: 'Введите название беседы'}),
                    this.saveButtonNode = d('button.btn.dialog__submit', {events: {click: this.onSave}}, 'Создать беседу'),
                )
            )
        );
    }
}

class DialogFriend extends Component {
    checkboxNode;

    constructor(model, user) {
        super();
        this.model = model;
        this.user = user;
    }

    onToggleSelect = (event) => {
        this.model.toggleUser(this.user);
        event.preventDefault();
    };

    update() {
        this.checkboxNode.setAttribute('checked', this.model.userIsSelected(this.user));
    }

    render() {
        return (
            d('a.friend', {href: 'http://vk.com', events: {click: this.onToggleSelect}},
                d('div.friend__inner', null,
                    d('div.friend__photo', {style: {backgroundImage: `url(${this.user.photo})`}}),
                    d('div.friend__name', null, this.user.fullName),
                    this.checkboxNode = d('div.checkbox.friend__checkbox', {checked: this.model.userIsSelected(this.user)}),
                )
            )
        );
    }
}

class DialogUserItem extends Component {
    constructor(model, user) {
        super();
        this.model = model;
        this.user = user;
    }

    onRemove = () => {
        this.model.toggleUser(this.user);
    };

    render() {
        return (
            d('div.user-item', null,
                d('div.user-item__name', null, this.user.fullName),
                d('span.clear.user-item__clear', {title: "Удалить собеседника", events: {click: this.onRemove}})
            )
        );
    }
}
