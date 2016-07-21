import {Api} from './lib/api';
import {d} from './lib/dom';
import {DialogView} from './dialog-view';
import {DialogModel} from './models/dialog';

const config = {
    appId: 5555903
};

const api = new Api(config.appId);
api.auth().then(data => {
    console.log(data);
    const dialogModel = new DialogModel(api);
    dialogModel.fetch().then(()=> {
        const dialogView = new DialogView(dialogModel);
        document.body.appendChild(d(dialogView));
    });
}).catch(err => console.error(err));



