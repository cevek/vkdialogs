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
                var style = attrs.style;
                for (const prop in style) {
                    if (style.hasOwnProperty(prop)) {
                        node.style[prop] = style[prop];
                    }
                }
            } else if (attr == 'events') {
                var events = attrs.events;
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

export class Component {
    rootNode;
    mount = false;

    destroy() {
        this.onDestroy();
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

export class List extends Component {
    constructor(params) {
        super();
        this.params = params;
        this.keyMap = {};
        this.items = this.makeItems(params.array, this.keyMap);
    }

    getItems() {
        return this.items;
    }

    makeItems(sourceArray, keyMap) {
        return sourceArray.map((item, i) => {
            var key = this.params.key(item, i);
            keyMap[key] = item;
            return {key, item, node: null, view: null};
        });
    }

    update(newArray) {
        const newKeyMap = {};
        const newItems = this.makeItems(newArray, newKeyMap);
        let j = 0;
        let before = this.items.length ? this.items[0].node : null;
        var usedOldKeys = {};
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
                var view = this.params.view(newItem.item, i);
                var node = prepareDom(view);
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
        this.items = newItems;
    }

    render() {
        return this.rootNode = d('div', this.params.props, ...this.items.map((item, i) => {
            var view = this.params.view(item.item, i);
            var node = prepareDom(view);
            item.node = node;
            item.view = view;
            return node;
        }))
    }
}