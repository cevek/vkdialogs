/**
 * Create dom element
 * @param tag {string | Component}
 * @param attrs? {Object}
 * @param children? {string | Node | Component[]}
 * @return {Element}
 */
export function d(tag, attrs, ...children) {
    if (tag instanceof Component) {
        return prepareDom(tag);
    }
    const tagSplit = tag.split('.');
    if (tagSplit.length > 1) {
        tag = tagSplit.shift();
        if (!attrs) {
            attrs = {};
        }
        const cls = tagSplit.join(' ');
        if (attrs.class) {
            attrs.class = cls + ' ' + attrs.class;
        } else {
            attrs.class = cls;
        }
    }
    const node = document.createElement(tag);
    prepareAttrs(attrs, node);
    for (let i = 0; i < children.length; i++) {
        var child = children[i];
        node.appendChild(prepareDom(child));
        if (child instanceof Component && child.onDidMount) {
            child.onDidMount();
        }
    }
    return node;
}

function prepareAttrs(attrs, node) {
    for (const attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            if (attr === 'style') {
                const style = attrs.style;
                for (const prop in style) {
                    if (style.hasOwnProperty(prop)) {
                        node.style[prop] = style[prop];
                    }
                }
            } else if (attr == 'events') {
                const events = attrs.events;
                for (const event in events) {
                    if (events.hasOwnProperty(event)) {
                        node.addEventListener(event, events[event]);
                    }
                }
            } else if (attr == 'checked') {
                node[attr] = attrs[attr];
            } else {
                node.setAttribute(attr, attrs[attr]);
            }
        }
    }
}

function prepareDom(child) {
    if (child instanceof Component) {
        child = child.initHTML();
    }
    else if (!(child instanceof Node)) {
        child = document.createTextNode(child);
    }
    return child;
}

/**
 * Base Model for view components
 */
export class Component {
    rootNode;
    mount = false;

    destroy() {
        if (this.onDestroy) {
            this.onDestroy();
        }
        this.rootNode.parentNode.removeChild(this.rootNode);
    }

    initHTML() {
        this.rootNode = this.render();
        this.mount = true;
        return this.rootNode;
    }

    render() {
        return null;
    }
}

/**
 * Component to render lists with diff update
 * It maps array items with generated dom elements
 */
export class List extends Component {
    _visibleKeyMap = {};

    /**
     * @param.props {Object} - props to root elements
     * @param.array {T[]} - source array of any data
     * @param.key {Function} (item, i)=>string - Callback to take unique id from the item
     * @param.view {Function} (item, i)=>Node|Component - Callback to take render view
     */
    constructor(params) {
        super();
        this.params = params;
        this.keyMap = this._visibleKeyMap = {};
        this.items = this._makeItems(params.array, this.keyMap);
    }

    /**
     * Get current items
     * @return {{key: string, node: Node, view: Component, item: T}[]}
     */
    getItems() {
        return this.items.slice();
    }

    _makeItems(sourceArray, keyMap) {
        return sourceArray.map((value, i) => {
            const key = this.params.key(value, i);
            const item = {key, value, node: null, view: null};
            keyMap[key] = item;
            return item;
        });
    }

    /**
     * Diff new array with old array and render the difference
     * @param newArray {T[]} - new array to apply to the list
     */
    update(newArray) {
        const newKeyMap = {};
        const newItems = this._makeItems(newArray, newKeyMap);
        let j = 0;
        let before = this.items.length ? this.items[0].node : null;
        const usedOldKeys = {};
        for (let i = 0; i < newItems.length; i++) {
            const newItem = newItems[i];
            const oldItem = this.items[j];

            if (oldItem && oldItem.key == newItem.key) {
                j++;
                newItem.node = oldItem.node;
                newItem.view = oldItem.view;
                before = oldItem.node.nextSibling;
                usedOldKeys[oldItem.key] = true;
            } else {
                const view = this.params.view(newItem.value, i);
                const node = prepareDom(view);
                newItem.node = node;
                newItem.view = view;
                this.rootNode.insertBefore(node, before);
            }
        }
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (!usedOldKeys[item.key]) {
                item.node.parentNode.removeChild(item.node);
            }
        }
        //todo: move old node
        this.keyMap = this._visibleKeyMap = newKeyMap;
        this.items = newItems;
    }

    /**
     * Diff new array with old array and apply difference using "hidden" class name
     * @param newArray {T[]} - new array to apply to the list
     */
    updateVisible(newArray) {
        const newKeyMap = {};
        const newItems = this._makeItems(newArray, newKeyMap);
        const usedOldKeys = {};
        for (let i = 0; i < newItems.length; i++) {
            const newItem = newItems[i];
            const mountItem = this.keyMap[newItem.key];
            if (mountItem) {
                if (!this._visibleKeyMap[newItem.key]) {
                    mountItem.node.classList.remove('hidden');
                }
                usedOldKeys[newItem.key] = true;
            }
        }
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (!usedOldKeys[item.key]) {
                if (this._visibleKeyMap[item.key]) {
                    item.node.classList.add('hidden');
                }
            }
        }
        this._visibleKeyMap = newKeyMap;
    }

    render() {
        return this.rootNode = d('div', this.params.props, ...this.items.map((item, i) => {
            const view = this.params.view(item.value, i);
            const node = prepareDom(view);
            item.node = node;
            item.view = view;
            return node;
        }))
    }
}


export class InfinityList extends Component {
    freeViews = [];
    viewModels;
    keyMap = {};
    spaceNode;

    constructor(params) {
        super();
        this.params = params;
        this._createViewModels();
    }

    _createViewModels() {
        this.viewModels = new Array(this.params.array);
        for (let i = 0; i < this.params.array.length; i++) {
            const value = this.params.array[i];
            const key = this.params.key(value, i);
            const vm = {
                top: i * this.params.height,
                hidden: false,
                view: null,
                key,
                value
            };
            this.keyMap[key] = vm;
            this.viewModels[i] = vm;
        }
    }

    filterResults(array) {
        const usedKeys = {};
        for (let i = 0; i < array.length; i++) {
            const key = this.params.key(array[i], i);
            const vm = this.keyMap[key];
            if (vm) {
                vm.hidden = false;
                vm.top = i * this.params.height;
                usedKeys[key] = true;
            }
        }
        for (let i = 0; i < this.viewModels.length; i++) {
            const vm = this.viewModels[i];
            if (!usedKeys[vm.key]) {
                vm.hidden = true;
            }
        }
        this.spaceNode.style.height = `${array.length * this.params.height}px`;
        this._updateViews();
    }

    _createViews() {
        this.views = new Array(30);
        for (let i = 0; i < this.views.length; i++) {
            const view = this.params.view();
            this.views[i] = view;
        }
        this.freeViews = this.views.slice();
    }

    _updateViews = () => {
        const viewportTop = this.rootNode.scrollTop;
        const rect = this.rootNode.getBoundingClientRect();
        const viewportBottom = viewportTop + rect.height;
        const {height} = this.params;
        const {freeViews} = this;
        const viewportVMs = [];
        for (let i = 0; i < this.viewModels.length; i++) {
            const vm = this.viewModels[i];
            if (vm.top + height >= viewportTop && vm.top < viewportBottom && !vm.hidden) {
                viewportVMs.push(vm);
            } else {
                if (vm.view) {
                    freeViews.push(vm.view);
                    vm.view = null;
                }
            }
        }
        for (let i = 0; i < viewportVMs.length; i++) {
            const vm = viewportVMs[i];
            if (!vm.view) {
                const view = freeViews.pop();
                if (!view) {
                    throw new Error('views ended');
                }
                vm.view = view;
                vm.view.update(vm.value);
            }
            if (vm.view.rootNode.$hidden) {
                vm.view.rootNode.classList.remove('hidden');
                vm.view.rootNode.$hidden = false;
            }
            if (vm.view.rootNode.prevTop !== vm.top) {
                vm.view.rootNode.style.transform = `translateY(${vm.top}px)`;
                vm.view.rootNode.prevTop = vm.top;
            }
        }
        for (let i = 0; i < this.freeViews.length; i++) {
            const view = this.freeViews[i];
            if (!view.rootNode.$hidden) {
                view.rootNode.classList.add('hidden');
                view.rootNode.$hidden = true;
            }
        }
        this.freeViews = freeViews;
    };

    _onScroll = () => {
        this._updateViews();
    };


    _initViews() {
        const max = Math.min(this.views.length, this.viewModels.length);
        for (let i = 0; i < max; i++) {
            const view = this.views[i];
            view.rootNode.classList.add('infinity-list__item');
        }
    }

    onDestroy(){
        window.removeEventListener('resize', this._updateViews);
    }

    render() {
        this._createViews();
        const result = d('div.infinity-list', {...this.params.props, events: {scroll: this._onScroll}},
            this.spaceNode = d('div.infinity-list__space', {style: {height: `${this.viewModels.length * 50}px`}}),
            ...this.views);

        this._initViews();

        // todo: hack, need componentDidMount
        setTimeout(()=>{
            this._updateViews();
            window.addEventListener('resize', this._updateViews);
        });
        return result;
    }
}