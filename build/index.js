const fs = require('fs');
const { npmInstallTo } = require('npm-install-to');
const R = require('ramda');
const paths = {
    admin: '../admin',
    player: '../player',
    plugins: '../plugins',
    server: '../server'
}

const pluginList = [ 'money', 'exp', 'quests', 'inventory', 'prizes', 'random', 'lootboxes' ];
const admin = {
    pages: { 
        '/': { label: ['global', 'homepage'], icon: `HomeIcon`, menu: 'tab', components: [] },
        appRoot: { label: ['rdzeń aplikacji'], icon: null, menu: 'none', components: [] } 
    },
    components: {},
    defaultState: {},
    i18n: {
        global: {
            homepage: 'Strona Główna',
            player: 'Gracz',
            amount: 'Ilość',
        }
    },
    path: paths.admin,
    menuIcons: new Set(['Home']), 
}
const player = {
    pages: { 
        '/': { label: ['global', 'homepage'], icon: `PersonIcon`, menu: 'tab', components: [] },
        appRoot: { label: ['rdzeń aplikacji'], icon: null, menu: 'none', components: [] }
    },
    components: {},
    defaultState: {},
    i18n: {
        global: {
            homepage: 'Profil'
        }
    },
    path: paths.player,
    menuIcons: new Set(['Person']), 
}
const server = {
    i18n: {},
    components: [],
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
    list[href] = {label: label.split('.'), menu, icon: getIcon(o.menuIcons, icon), components: (list[href]||{ components: [] }).components };
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
const i18n = (list, plugin, i18n)=>list[plugin]=R.mergeDeepRight(list[plugin], i18n);
const applyToState = (o, fn)=>callbacks.push(()=>o.defaultState = R.mergeDeepRight(o.defaultState, fn(o.defaultState)) );

const npmInstall = (path, modules)=>npmInstallTo(path, modules)
const arePluginsIncluded = (plugins=[])=>!plugins.some(plugin=>!pluginList.includes(plugin));
const addComponentToArray = (o, path, component)=>applyToState(o, 
    state=>R.assocPath(path.split('.'), [
        ...(R.path(path.split('.'), state)||[]), 
        typeof component==='object'?component:{ id: `__${component}`, component: component }
    ], state)
);


const preparePersonApi = (o, plugin)=>({
        addPage: addPage.bind(null, o),
        addComponent: addComponent.bind(null, plugin, o.components),
        addToPage: addToPage.bind(null, o.pages),
        setState: setPluginState.bind(null, o.defaultState, plugin),
        applyToState: applyToState.bind(null, o),
        npmInstall: npmInstall.bind(null, o.path),
        i18n: i18n.bind(null, o.i18n, plugin),
        addExtension:  addComponentToArray.bind(null, o),

});

pluginList.forEach(plugin=>{
    const _api = { 
        admin: preparePersonApi(admin, plugin), 
        player: preparePersonApi(player, plugin),
        server: {
            npmInstall: npmInstall.bind(null, paths.server),
            addComponent: (file)=>{
                server.components.push({plugin, file});
            },
            i18n: i18n.bind(null, server.i18n, plugin),
            setState: ()=>{}
        },
        arePluginsIncluded,
        materialIcon: type=>new MaterialIcon(type),

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
    const path = `${paths.player}/src/plugins/${player.components[key].plugin}`;
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) throw err;
        fs.existsSync(path) || fs.mkdirSync(path);
        fs.copyFile(`${paths.plugins}/${player.components[key].plugin}/${player.components[key].file}`, `${path}/${player.components[key].file}`, (err)=>{ if(err) throw err; });
    
    });
})


const importRegex = /\/\/import([a-zżźćńółęąś0-9'"\-@,\{\}$_\/\.;\s]+)\/\/import\/\//gim;
const setupRegex = /\/\/setup([a-zżźćńółęąś0-9'"\}\{:$_\/\.;=\s\(\)\[\],\?]+)\/\/setup\/\//gim;

const getComponentsImport = o=>Object.keys(o.components).map(key=>`import ${key} from './plugins/${o.components[key].plugin}/${o.components[key].file}';`).join('\n');
const getIconsImport = o => `import {${Array.from(o.menuIcons).map(name=>`${name} as ${name}Icon`).join(', ')}} from '@material-ui/icons';`
const getImport = o=>getComponentsImport(o)+"\n"+getIconsImport(o);
const getSetupComponents = o =>Object.keys(o.components).map(key=>`addComponent('${key}', ${key});`).join('\n');
const getSetupPages = o =>Object.keys(o.pages).map(href=>`addPage('${href}', [${o.pages[href].label.map(el=>`"${el}"`)}], "${o.pages[href].menu}", ${o.pages[href].icon});`).join('\n');
const getComponentPages = o => Object.keys(o.pages).map(href=>o.pages[href].components.map(component=>`addComponentPage('${component}', '${href}')`).join('\n')).join('\n');
const getPluginState = o => {
    let state = Object.keys(o.defaultState).map(key=>`setPluginState('${key}', ${JSON.stringify(o.defaultState[key])})`).join('\n');
    Object.keys(o.components).forEach(key=>state=state.replace(new RegExp(`"${key.replace(/\$/g, '\\\$')}"`, 'g'), key));
    return state;
};

const setDictionary = o => `defaultState.i18n = ${JSON.stringify(o.i18n)};`;

[admin, player].forEach(o=>{

    const SetupImport = getImport(o);
    const SetupComponents = getSetupComponents(o);
    const SetupPages = getSetupPages(o);
    const AddComponentsToPages = getComponentPages(o);
    const SetPluginState = getPluginState(o);
    const SetupDictionary = setDictionary(o);
    fs.readFile(`${o.path}/src/reducer.js`, (err, data)=>{
        if(err) return console.error(err);
        data = String(data);
        data = data.replace(importRegex, `//import
${SetupImport}
//import//`).replace(setupRegex, `//setup
${SetupComponents}
${SetupPages}
${AddComponentsToPages}
${SetPluginState}
${SetupDictionary}
//setup//`);
fs.writeFile(`${o.path}/src/reducer.js`, data, (err) => {
    if (err) throw err;
});
    });
})

fs.readdir(`${paths.server}/plugins`, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(`${paths.server}/plugins/${file}`, err => {
        if (err) throw err;
      });
    }
    server.components.forEach(component=>{
        fs.copyFile(`${paths.plugins}/${component.plugin}/${component.file}`, `${paths.server}/plugins/${component.plugin}_${component.file}`, (err)=>{
            if(err) console.error(err);
        })
    })
  });

  fs.writeFile(`${paths.server}/data/pluginList.json`, JSON.stringify(pluginList), err=>{
      if(err) throw err;
  })

//   console.log(player, admin, server);