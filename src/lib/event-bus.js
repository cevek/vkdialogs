export class EventBus {
    subscribers = [];

    subscribe(event, callback) {
        this.subscribers.push({event, callback});
    }

    unsubscribe(event, callback) {
        const pos = this.subscribers.findIndex(sb => sb.event == event && sb.callback == callback);
        if (pos > -1) {
            this.subscribers.splice(pos, 1);
        }
    }

    fire(event, value) {
        this.subscribers.filter(sb => sb.event == event).forEach(sb => sb.callback(value));
    }

}