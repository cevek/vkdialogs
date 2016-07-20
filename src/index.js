import {Api} from './lib/api';
import {d} from './lib/dom';
import {DialogView} from './dialog-view';
import {DialogModel} from './models/dialog';

const config = {
    api: {

    }
};

const api = new Api(config.api);
const dialogModel = new DialogModel(api);
dialogModel.fetch().then(()=> {
    const dialogView = new DialogView(dialogModel);
    document.body.appendChild(d(dialogView));
});


