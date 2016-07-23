import "babel-polyfill";
import "./styles/main.less";
import {Api} from "./lib/api";
import {d} from "./lib/dom";
import {App} from "./components/app";
import {config} from "./config";

const api = new Api(config.api);
const app = new App(api);
document.body.appendChild(d(app));