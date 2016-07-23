import {Component} from "../lib/dom";
import {d} from "../lib/dom";
import {DialogViewModel} from "../models/dialog";
import {DialogView} from "./dialog";

export class App extends Component {
    loaderNode;

    constructor(api) {
        super();
        this.api = api;
    }

    render() {
        const model = new DialogViewModel(this.api);
        model.fetchUsers().then(()=> {

            const dialogView = new DialogView(model);
            this.rootNode.appendChild(d(dialogView));

            this.loaderNode.classList.add('hidden');
        });

        return d('div.app', null,
            this.loaderNode = d('div', null, 'Загрузка...')
        )
    }
}
