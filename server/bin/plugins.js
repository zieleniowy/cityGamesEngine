const fs = require('fs');
const cmd = require('../bin/commands');
const register = require('../bin/register');
const genid = require('../bin/genid');
const game = require('../bin/game');
const accounts = require('../bin/accounts');
const io = require('../bin/socket');
const either = require('../bin/either');
const pluginList = require('../data/pluginList.json');
const R = require('ramda');

const callbacks = [];

const api = {
    cmd,
    register,
    game,
    genid,
    accounts,
    io,
    either,
    pluginList,
    arePluginsIncluded: (plugins=[])=>!plugins.some(plugin=>!pluginList.includes(plugin)),
    onPluginsReady: (callback)=>callbacks.push(callback)

};

const files = fs.readdirSync('./plugins');


const loaded = files.map(file=>file.endsWith('.js')?{ name: file, fn: require(`../plugins/${file}`) }:null)
    .filter(Boolean)
    .map(file=>({ name: file.name, fn: file.fn, result: file.fn(api) }));

const byPlugin = R.groupBy(({ name })=>name.match(/([a-z0-9]+)_/)[1]);

const filesGroupedByPlugins = byPlugin(loaded)

const pluginLoadedResults = R.map((filesArr)=>filesArr.reduce((prev, cur)=>({ ...prev, ...cur.result }), {}), filesGroupedByPlugins);

callbacks.forEach(callback=>callback(pluginLoadedResults));