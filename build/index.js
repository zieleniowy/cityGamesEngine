const fs = require('fs');
const { npmInstallTo } = require('npm-install-to');
const paths = {
    admin: '../admin',
    player: '../player',
    plugins: '../plugins',
    server: '../server'
}

const pluginList = [ 'money' ];

const admin = {
    pages: { 
        '/': { label: 'Strona Główna', icon: `HomeIcon`, menu: 'tab', components: [] },
        appRoot: { label: 'rdzeń aplikacji', icon: null, menu: 'none', components: [] } 
    },
    components: {},
    defaultState: {},
    i18n: {},
    path: paths.admin,
    menuIcons: new Set(['Home']), 
}
const player = {
    pages: { 
        '/': { label: 'Profil', icon: `PersonIcon`, menu: 'tab', components: [] },
        appRoot: { label: 'rdzeń aplikacji', icon: null, menu: 'none', components: [] }
    },
    components: {},
    defaultState: {},
    i18n: {},
    path: paths.player,
    menuIcons: new Set(['Person']), 
}
const server = {
    i18n: {},
}
const callbacks = [];

function MaterialIcon(type){ this.type = type; }
const getIcon = (set, icon)=>{
    if(icon instanceof MaterialIcon){
        set.add(icon.type);
        icon = `${icon.type}Icon`;
    }
    return icon;
}

const addPage = (o, href, label, menu, icon) => {
    list = o.pages;
    list[href] = {label, menu, icon: getIcon(o.menuIcons, icon), components: (list[href]||{ components: [] }).components };
}
const addComponent = (plugin, list, file, name)=>{
    const id = `${name}$${plugin}`;
    list[id] = {plugin, file};
    return id;
}
const addToPage = (list, name, page)=>{
    if(name){
        list[page].components.push(name);
    }
}
const setPluginState = (list, plugin, state)=>list[plugin]=state;
const i18n = (list, plugin, i18n)=>list[plugin]=i18n;
const applyToState = (o, fn)=>callbacks.push(()=>o.defaultState = fn(o.defaultState));

const npmInstall = (path, modules)=>npmInstallTo(path, modules)
const arePluginsIncluded = (plugins=[])=>!plugins.some(plugin=>!pluginList.includes(plugin));

const preparePersonApi = (o, plugin)=>({
        addPage: addPage.bind(null, o),
        addComponent: addComponent.bind(null, plugin, o.components),
        addToPage: addToPage.bind(null, o.pages),
        setState: setPluginState.bind(null, o.defaultState, plugin),
        applyToState: applyToState.bind(null, o),
        npmInstall: npmInstall.bind(null, o.path),
        setDictionary: (o)=>i18n[plugin]=o,
        i18n: i18n.bind(null, o.i18n, plugin),

});

pluginList.forEach(plugin=>{
    const _api = { 
        admin: preparePersonApi(admin, plugin), 
        player: preparePersonApi(player, plugin),
        server: {
            npmInstall: npmInstall.bind(null, paths.server),
            addComponent: ()=>{},
            i18n: i18n.bind(null, server.i18n, plugin),
        },
        arePluginsIncluded
    }
    require(`${paths.plugins}/${plugin}/manifest`)(_api);
})

callbacks.forEach(cb=>cb());

