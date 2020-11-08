//import
import Give$money from './plugins/money/MoneyGive.js';
import Icon$quests from './plugins/quests/QuestsIcon.js';
import Create$quests from './plugins/quests/QuestCreate.js';
import StatusSelect$quests from './plugins/quests/StatusSelect.js';
import FetchItemList$inventory from './plugins/inventory/clientFetchItemList.js';
import {Home as HomeIcon} from '@material-ui/icons';
//import//


const defaultState = {
    components: {},
    pages: [],
    players: null,
    token: localStorage["auth_token"],
}

window.socket.emit('authToken', localStorage["auth_token"]);
window.socket.on('reconnect', ()=>window.socket.emit('authToken', localStorage["auth_token"]));


const addComponent = (name, component, page)=>{
  defaultState.components[name] = { component, pages: [] };
}
const addComponentPage = (name, page)=>{
  defaultState.components[name].pages.push(page);
}
const addPage = (href, label, menu, icon)=>defaultState.pages.push({ href, label, menu, icon });
const setPluginState = (plugin, state={})=>defaultState[plugin] = state;
//setup
addComponent('Give$money', Give$money);
addComponent('Icon$quests', Icon$quests);
addComponent('Create$quests', Create$quests);
addComponent('StatusSelect$quests', StatusSelect$quests);
addComponent('FetchItemList$inventory', FetchItemList$inventory);
addPage('/', ["global","homepage"], "tab", HomeIcon);
addPage('appRoot', ["rdzeń aplikacji"], "none", null);
addPage('/quests', ["quests","quests"], "tab", Icon$quests);
addComponentPage('Give$money', '/')

addComponentPage('Create$quests', '/quests')
setPluginState('quests', {"createExtensions":[]})
defaultState.i18n = {"global":{"homepage":"Strona Główna","player":"Gracz","amount":"Ilość"},"money":{"transfer":"przelej gotówkę"},"quests":{"noQuests":"Brak zadań do wyświetlenia","create":"stwórz zadanie","questTitle":"tytuł zadania","questMetaTitle":"tytuł pomocniczy","description":"opis zadania","addQuest":"dodaj zadanie","defaultStatus":"domyślny stan","status":"stan zadania","quests":"zadania","completed":"Ukończone","inactive":"Niekatywne","active":"Aktywne","failed":"Zepsute","whenVisible":"Stany, w których widoczne dla gracza"}};
//setup//

export default (state=defaultState, action) => {
    switch (action.type) {
      case 'LOGIN': 
        localStorage['auth_token'] = action.payload;
        return {...state, token: action.payload}
      case 'SET':
        return {...state, ...action.payload}
      case 'SET_PLUGIN_PROP':
        return {...state, [action.payload.plugin]: { ...state[action.payload.plugin], [action.payload.prop]: action.payload.value }};
      case 'APPLY': 
        return { ...state, ...action.payload(state) }
      default:
        return state
    }
  }