//import
import Status$money from './plugins/money/MoneyStatus.js';
import ExpBar$exp from './plugins/exp/PlayerExpBar.js';
import FetchItemList$inventory from './plugins/inventory/clientFetchItemList.js';
import ItemList$inventory from './plugins/inventory/ItemList.js';
import Inventory$inventory from './plugins/inventory/PlayerInventory.js';
import {Person as PersonIcon, Today as TodayIcon} from '@material-ui/icons';
//import//



const token = localStorage["auth_token"]||null;

const defaultState = {
    components: {},
    pages: [],
    account: null,
    token,
}

window.socket.emit('authToken', token);
window.socket.on('reconnect', ()=>window.socket.emit('authToken', token));


const addComponent = (name, component, page)=>{
  defaultState.components[name] = { component, pages: [] };
}
const addComponentPage = (name, page)=>{
  defaultState.components[name].pages.push(page);
}
const addPage = (href, label, menu, icon)=>defaultState.pages.push({ href, label, menu, icon });
const setPluginState = (plugin, state={})=>defaultState[plugin] = state;
//setup
addComponent('Status$money', Status$money);
addComponent('ExpBar$exp', ExpBar$exp);
addComponent('FetchItemList$inventory', FetchItemList$inventory);
addComponent('ItemList$inventory', ItemList$inventory);
addComponent('Inventory$inventory', Inventory$inventory);
addPage('/', ["global","homepage"], "tab", PersonIcon);
addPage('appRoot', ["rdzeń aplikacji"], "none", null);
addPage('/inventory', ["inventory","eq"], "drawer", TodayIcon);
addComponentPage('ExpBar$exp', '/')
addComponentPage('Inventory$inventory', '/')


setPluginState('inventory', {"extensions":{"beforePlayerEq":[{"id":"moneyStatus","component":Status$money}]}})
defaultState.i18n = {"global":{"homepage":"Profil"},"inventory":{"eq":"Ekwipunek","unknown":"Przedmiot Nierozpoznany"}};
//setup//
Object.defineProperty(window, 'i18n', { get: ()=>window.store.getState().i18n });

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