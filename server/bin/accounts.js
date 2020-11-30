const R = require('ramda');
const register = require('./register');
const cmd = require('./commands');
const genid = require('./genid');
const game = require('./game');
const Either = require('./either');
const getObjectFromArray = require('./getObjectFromArray');

var passes = {};

const initial = account => ({ id: genid(), name: '',  ...account});
const get = arr => getObjectFromArray('id', game[arr]);

const getPlayer = get('players');
const getAdmin = get('admins');

const $getOrThrow = (arr, path) => o => R.assocPath(path, get(arr)(R.path(path, o)).getOrElseThrow(game.i18n.global.$noUser), o);
const $getPlayerOrThrow = path => $getOrThrow('players', path.split('.'));
const $getAdminOrThrow = path => $getOrThrow('admins', path.split('.'));

const setType = key => o => Object.defineProperty(o, 'type', { value: key, writable: false, enumerable: true });

const createAccount = (arr, type) => R.pipe(
    initial, 
    register.load(`${type}BeforeAdd`), 
    R.tap(o=>passes[o.id] = o.pass),
    R.omit(['pass', 'type']),
    setType(type), 
    R.tap(o=>arr.push(o)), 
    register.load(`${type}AfterAdd`)
);
const isAdmin = subject=>subject?.type==='admin';
const isPlayer = subject=>subject?.type==='player';

const createPlayer = createAccount(game.players, 'player');
const createAdmin = createAccount(game.admins, 'admin'); 

cmd.register('fetchPlayerList', ({payload})=>R.map(R.pick(payload?.pick||["id", "name"]), game.players), isAdmin);
cmd.register('getPasses', ({payload})=>R.map(R.prop(R.__, passes), payload), R.F);

register.add('afterGameSaveMerge', o=>({...o, passes }));
register.add('afterGameSaveFileLoad', R.tap(({data})=>{ passes = data.passes; }));
module.exports = {
    getPlayer,
    getAdmin,
    $getPlayerOrThrow,
    $getAdminOrThrow,
    createPlayer,
    createAdmin,
    isAdmin,
    isPlayer,
    update: (account, newProps)=>{
        //type is readonly - assign will throw an error if it's not omited
        Object.assign(account, R.omit(['type'], R.mergeDeepRight(account, newProps)));
        register.load('accountUpdate')({ socket: account.socket, account: account });
    },

}