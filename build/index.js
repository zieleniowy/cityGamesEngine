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





Object.keys(admin.components).forEach(key=>{
    const path = `${paths.admin}/src/plugins/${admin.components[key].plugin}`;
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) throw err;
        fs.existsSync(path) || fs.mkdirSync(path);
        fs.copyFile(`${paths.plugins}/${admin.components[key].plugin}/${admin.components[key].file}`, `${path}/${admin.components[key].file}`, (err)=>{ if(err) throw err; });
    
    });
})
Object.keys(player.components).forEach(key=>{
    const path = `${path.player}/src/plugins/${player.components[key].plugin}`;
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) throw err;
        fs.existsSync(path) || fs.mkdirSync(path);
        fs.copyFile(`${paths.plugins}/${player.components[key].plugin}/${player.components[key].file}`, `${paths.player}/plugins/${player.components[key].plugin}/${player.components[key].file}`, (err)=>{ if(err) throw err; });
    
    });
})


const importRegex = /\/\/import([a-zżźćńółęąś0-9'"\-@,\{\}$_\/\.;\s]+)\/\/import\/\//gim;
const setupRegex = /\/\/setup([a-zżźćńółęąś0-9'"\}\{:$_\/\.;=\s\(\)\[\],\?]+)\/\/setup\/\//gim;

const getComponentsImport = o=>Object.keys(o.components).map(key=>`import ${key} from './plugins/${o.components[key].plugin}/${o.components[key].file}';`).join('\n');
const getIconsImport = o => `import {${Array.from(o.menuIcons).map(name=>`${name} as ${name}Icon`).join(', ')}} from '@material-ui/icons';`
const getImport = o=>getComponentsImport(o)+"\n"+getIconsImport(o);
const getSetupComponents = o =>Object.keys(o.components).map(key=>`addComponent('${key}', ${key});`).join('\n');
const getSetupPages = o =>Object.keys(o.pages).map(href=>`addPage('${href}', "${o.pages[href].label}", "${o.pages[href].menu}", ${o.pages[href].icon});`).join('\n');
const getComponentPages = o => Object.keys(o.pages).map(href=>o.pages[href].components.map(component=>`addComponentPage('${component}', '${href}')`).join('\n')).join('\n');
const getPluginState = o => {
    let state = Object.keys(o.defaultState).map(key=>`setPluginState('${key}', ${JSON.stringify(o.defaultState[key])})`).join('\n');
    Object.keys(o.components).forEach(key=>state=state.replace(new RegExp(`"${key.replace(/\$/g, '\\\$')}"`, 'g'), key));
    return state;
};

const adminImport = getImport(admin);
const adminSetupComponents = getSetupComponents(admin);
const adminSetupPages = getSetupPages(admin);
const adminAddComponentsToPages = getComponentPages(admin);
const adminSetPluginState = getPluginState(admin);


const playerImport = getImport(player);
const playerSetupComponents = getSetupComponents(player);
const playerSetupPages = getSetupPages(player);
const playerAddComponentsToPages = getComponentPages(player);
const playerSetPluginState = getPluginState(player);

const dictionarySet = `window.i18n = ${JSON.stringify(i18n)};`;

// fs.readFile(`${paths.player}/src/reducer.js`, (err, data)=>{
//     if(err) return console.error(err);
//     data = String(data);
//     data = data.replace(importRegex, `//import
// ${playerImport}
// //import//`).replace(setupRegex, `//setup
// ${playerSetupComponents}
// ${playerSetupPages}
// ${playerAddComponentsToPages}
// ${playerSetPluginState}
// ${dictionarySet}
// //setup//`);
// fs.writeFile(`${paths.player}/src/reducer.js`, data, (err) => {
//     if (err) throw err;
//   });

// })

fs.readFile(`${paths.admin}/src/reducer.js`, (err, data)=>{
    if(err) return console.error(err);
    data = String(data);
    data = data.replace(importRegex, `//import
${adminImport}
//import//`).replace(setupRegex, `//setup
${adminSetupComponents}
${adminSetupPages}
${adminAddComponentsToPages}
${adminSetPluginState}
${dictionarySet}
//setup//`);
fs.writeFile(`${paths.admin}/src/reducer.js`, data, (err) => {
    if (err) throw err;
  });
});