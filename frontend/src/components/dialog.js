import {Component, List, InfinityList, d} from '../lib/dom';
import './dialog.less';

export class DialogView extends Component {
    model;
    selectedUsersCmp;
    friendListCmp;
    filterNode;
    filterInputNode;
    filterClearNode;
    actionsNode;
    saveButtonNode;

    placeholder = 'Введите имя или фамилию';

    constructor(model) {
        super();
        this.model = model;
        this.model.eventBus.subscribe('filteredUsers', this.onFilteredUsersChange);
        this.model.eventBus.subscribe('selectedUsers', this.onSelectedUsersChange);
        this.model.eventBus.subscribe('loaded', this.onLoaded);
    }

    onDestroy() {
        this.model.eventBus.unsubscribe('filteredUsers', this.onFilteredUsersChange);
        this.model.eventBus.unsubscribe('selectedUsers', this.onSelectedUsersChange);
        this.model.eventBus.unsubscribe('loaded', this.onLoaded);

    }

    onFilteredUsersChange = filteredUsers => {
        if (this.mount) {
            this.friendListCmp.filterResults(filteredUsers);
        }
    };

    resizeFilterInput(filterRectBefore) {
        const lastItem = this.selectedUsersCmp.getItems().pop();
        if (lastItem) {
            const tokenRect = lastItem.node.getBoundingClientRect();
            const size = filterRectBefore.right - tokenRect.right - 10;
            const isOverMinWith = size > 100;
            this.filterInputNode.style.width = isOverMinWith ? `${size}px` : '99%';
        } else {
            this.filterInputNode.style.width = '';
        }

        const filterRectAfter = this.filterNode.getBoundingClientRect();
        const heightDiff = filterRectBefore.height - filterRectAfter.height;
        if (heightDiff) {
            this.friendListCmp.rootNode.scrollTop -= heightDiff;
        }
    }


    onSelectedUsersChange = selectedUsers => {
        if (this.mount) {
            if (selectedUsers.length > 1) {
                this.actionsNode.classList.remove('dialog__actions--hidden');
            } else {
                this.actionsNode.classList.add('dialog__actions--hidden');
            }
            this.filterInputNode.placeholder = selectedUsers.length == 0 ? this.placeholder : '';
            this.friendListCmp.updateViews(true);
            this.filterInputNode.focus();
            this.onFilterClear();

            const filterRect = this.filterNode.getBoundingClientRect();
            this.selectedUsersCmp.update(selectedUsers);
            this.resizeFilterInput(filterRect);
            if (selectedUsers.length > 0) {
                this.filterClearNode.classList.add('dialog__hidden');
            } else {
                this.filterClearNode.classList.remove('dialog__hidden');
            }
        }
    };

    onLoaded = () => {
        this.filterClearNode.classList.remove('dialog__spinner');
    };

    onClose = () => {
        this.destroy();
    };

    onFilterInput = (event) => {
        const text = event.target.value;
        if (text) {
            this.filterClearNode.classList.remove('hidden');
            this.filterClearNode.classList.add('dialog__spinner');
        } else {
            this.filterClearNode.classList.add('hidden');
        }
        this.model.setFilterText(text);
    };

    onFilterClear = () => {
        this.model.setFilterText('');
        this.filterInputNode.value = '';
        this.filterClearNode.classList.add('hidden');
    };

    isShadowVisible = false;
    onScroll = (event) => {
        if (event.target.scrollTop == 0) {
            this.filterNode.classList.remove('shadow');
            this.isShadowVisible = false;
        } else if (!this.isShadowVisible) {
            this.filterNode.classList.add('shadow');
            this.isShadowVisible = true;
        }
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
        this.friendListCmp = new InfinityList({
            props: {class: 'dialog__friend-list', events: {scroll: this.onScroll}},
            height: 50,
            array: this.model.allUsers,
            key: user => user.id,
            view: user => new DialogFriend(this.model)
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
                this.filterNode = d('div.dialog__filter', null,
                    this.selectedUsersCmp,
                    this.filterInputNode = d('input.dialog__input', {
                        type: 'text',
                        autocomplete: 'off',
                        spellcheck: false,
                        placeholder: this.placeholder,
                        events: {input: this.onFilterInput}
                    }),
                    this.filterClearNode = d('span.clear.dialog__clear.hidden', {events: {click: this.onFilterClear}})
                ),
                this.friendListCmp,
                this.actionsNode = d('div.dialog__actions.dialog__actions--hidden', null,
                    d('input.dialog__name', {placeholder: 'Введите название беседы'}),
                    this.saveButtonNode = d('button.btn.dialog__submit', {events: {click: this.onSave}}, 'Создать беседу'),
                )
            )
        );
    }
}

class DialogFriend extends Component {
    photoNode;
    nameNode;
    checkboxNode;

    constructor(model) {
        super();
        this.model = model;
    }

    onToggleSelect = (event) => {
        this.model.toggleUser(this.user);
        event.preventDefault();
    };

    update(user) {
        this.user = user;
        this.nameNode.textContent = user.fullName;
        this.photoNode.style.backgroundImage = `url(${user.photo})`;
        this.checkboxNode.setAttribute('checked', this.model.userIsSelected(user));
    }

    render() {
        return (
            d('a.friend', {href: 'http://vk.com', events: {click: this.onToggleSelect}},
                d('div.friend__inner', null,
                    this.photoNode = d('div.friend__photo', null),
                    this.nameNode = d('div.friend__name', null, ''),
                    this.checkboxNode = d('div.checkbox.friend__checkbox', {checked: false}),
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
