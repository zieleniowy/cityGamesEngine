//import

//import//



const token = localStorage["auth_token"]||null;

const defaultState = {
    components: {},
    pages: [],
    players: null,
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