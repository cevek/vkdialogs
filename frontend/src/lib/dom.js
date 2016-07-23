/**
 * Create dom element
 * @param tag {string | Component}
 * @param attrs {Object}
 * @param children {string | Node | Component[]}
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
        attrs.class = tagSplit.join(' ');
    }
    const node = document.createElement(tag);
    prepareAttrs(attrs, node);
    for (let i = 0; i < children.length; i++) {
        node.appendChild(prepareDom(children[i]));
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