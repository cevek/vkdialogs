import {Component} from "../lib/dom";
import {d} from "../lib/dom";
import {DialogViewModel} from "../models/dialog";
import {DialogView} from "./dialog";
import './app.less';

export class App extends Component {
    constructor(api) {
        super();
        this.api = api;
    }

    render() {
        const model = new DialogViewModel(this.api);
        document.body.classList.add('app__loader');
        model.fetchUsers().then(()=> {
            const dialogView = new DialogView(model);
            this.rootNode.appendChild(d(dialogView));
            document.body.classList.remove('app__loader');
        });

        return d('div.app', null)
    }
}
