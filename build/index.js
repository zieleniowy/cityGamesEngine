const fs = require('fs');
const { npmInstallTo } = require('npm-install-to')
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
    path: paths.player,
    menuIcons: new Set(['Person']), 
}
const i18n = {
    global: {
        login: 'login',
        add: 'dodaj',
        save: 'zapisz',
        tools: 'narzędzia',
        title: 'tytuł',
        desc: 'opis'
    }
};

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
const setPluginState = (list, plugin, state)=>{
    list[plugin]=state;
}
const npmInstall = (path, modules)=>npmInstallTo(path, modules)
const arePluginsIncluded = (plugins=[])=>!plugins.some(plugin=>!pluginList.includes(plugin));

const preparePersonApi = (o, plugin)=>({
        addPage: addPage.bind(null, o),
        addComponent: addComponent.bind(null, plugin, o.components),
        addToPage: addToPage.bind(null, o.pages),
        setState: setPluginState.bind(null, o.defaultState, plugin),
        npmInstall: npmInstall.bind(null, o.path)
        // npmInstall: 
});

pluginList.forEach(plugin=>{
    const _api = { 
        admin: preparePersonApi(admin, plugin), 
        player: preparePersonApi(player, plugin),
        server: {
            npmInstall: npmInstall.bind(null, paths.server)
        },
        arePluginsIncluded
    }
    require(`${paths.plugins}/${plugin}/manifest`)(_api);
    // fs.copyFile(`${paths.plugins}/${plugin}/server.js`, `${paths.server}/plugins/${plugin}.js`, (err)=>{ if(err) throw err; });
})

