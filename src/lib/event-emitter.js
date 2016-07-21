/**
 * Simple Event Emitter
 */
export class EventEmitter {
    _subscribers = [];

    /**
     * Subscribe event with callback
     * @param event {string}
     * @param callback {Function}
     */
    subscribe(event, callback) {
        this._subscribers.push({event, callback});
    }

    /**
     * Unsubscribe event with callback
     * @param event {string}
     * @param callback {Function}
     */
    unsubscribe(event, callback) {
        const pos = this._subscribers.findIndex(sb => sb.event == event && sb.callback == callback);
        if (pos > -1) {
            this._subscribers.splice(pos, 1);
        }
    }

    /**
     * Emit event with value
     * @param event {string}
     * @param value
     */
    fire(event, value) {
        this._subscribers.filter(sb => sb.event == event).forEach(sb => sb.callback(value));
    }
}