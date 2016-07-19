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
        let child = children[i];
        if (typeof child.render == 'function') {
            child = child.render();
        }
        else if (!(child instanceof Node)) {
            child = document.createTextNode(child);
        }
        el.appendChild(child);
    }
    return el;
}

export class Component {
    subscribers = [];

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
        for (var i = 0; i < this.subscribers.length; i++) {
            var subscriber = this.subscribers[i];
            subscriber.source.unsubscribe(subscriber.event, subscriber.callback);
        }
    }

    subscribe(source, event, callback) {
        this.subscribers.push({source, event, callback});
    }

    render() {
        return null;
    }
}

export class BaseModel {
    subscribers;

    subscribe(event, callback) {
        if (!this.subscribers) {
            this.subscribers = [];
        }
        this.subscribers.push({event, callback});
    }

    unsubscribe(event, callback) {
        if (this.subscribers) {
            const pos = this.subscribers.findIndex(sb => sb.event == event && sb.callback == callback);
            if (pos > -1) {
                this.subscribers.splice(pos, 1);
            }
        }
    }

    fireEvent(event) {
        if (this.subscribers) {
            this.subscribers.filter(sb => sb.event == event).forEach(sb => sb.callback());
        }
    }

}


export function translator(str) {
    return new RegExp(`(${[str].join('|')})`, 'i');
}