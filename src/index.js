import 'babel-polyfill';
import {Api} from './lib/api';
import {d} from './lib/dom';
import {DialogView} from './dialog-view';
import {DialogModel} from './models/dialog';

const config = {
    api: {
        appId: 5555903,
        scope: 2,
    }
};

var loader = document.body.appendChild(document.createElement('div'));
loader.textContent = 'Загрузка...';
const api = new Api(config.api);
api.auth().then(data => {
    const dialogModel = new DialogModel(api);
    dialogModel.fetch().then(()=> {
        const dialogView = new DialogView(dialogModel);
        document.body.appendChild(d(dialogView));
        loader.parentNode.removeChild(loader);
    });
    window.model = dialogModel;
}).catch(err => {
    loader.textContent = 'Произошла ошибка'
});