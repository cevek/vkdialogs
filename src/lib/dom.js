export function d(tag, attrs, ...children) {
    const tagSplit = tag.split('.');
    if (tagSplit.length > 1) {
        tag = tagSplit.shift();
        if (!attrs) {
            attrs = {class: tagSplit.join(' ')};
        }
    }
    const el = document.createElement(tag);
    for (const attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            el.setAttribute(attr, attrs[attr]);
        }
    }
    for (let i = 0; i < children.length; i++) {
        el.appendChild(prepareDom(children[i]));
    }
    return el;
}

function prepareDom(child){
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
        for (const name in this.components) {
            if (this.components.hasOwnProperty(name)) {
                const component = this.components[name];
                if (typeof component.onDestroy == 'function') {
                    component.onDestroy();
                }
                component.destroy();
            }
        }
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


export class List {
    constructor(props, sourceArray, keyFn, viewFn) {
        this.props = props;
        this.keyFn = keyFn;
        this.viewFn = viewFn;

        this.keyMap = {};
        this.items = this.makeItems(sourceArray, this.keyMap);
    }

    makeItems(sourceArray, keyMap) {
        return sourceArray.map((item, i) => {
            var key = this.keyFn(item, i);
            keyMap[key] = item;
            return {key, item, node: null};
        });
    }

    update(newArray) {
        const newKeyMap = {};
        const newItems = this.makeItems(newArray, newKeyMap);
        this.items.filter(item => !newItems.find(newItem => newItem.key == item.key)).forEach(item => {
            item.node.parent.removeChild(item.node.rootNode);
        });
        let j = 0;
        let before = this.items.length ? this.items[0].node : null;
        for (let i = 0; i < newItems.length; i++) {
            const newItem = newItems[i];
            const oldItem = this.items[j];
            if (oldItem.key == newItem.key) {
                j++;
                before = oldItem.node.nextSibling;
            } else {
                var node = prepareDom(this.viewFn(newItem.item, i));
                newItem.node = node;
                this.rootNode.insertBefore(node, before);
            }
        }
    }

    render() {
        return this.rootNode = d('div', this.props, ...this.items.map(item => item.view));
    }
}