global.rootDir = __dirname;

const R = require('ramda');
const cmd = require('./bin/commands');
const game = require('./bin/game');
const accounts = require('./bin/accounts');
const socket = require('./bin/socket');
const register = require('./bin/register');
const plugins = require('./bin/plugins');
const save = require('./bin/save');
require('./bin/timer');


// accounts.createPlayer({ 
//     id: '1',
//     name: 'zielen1', 
//     pass: 'xxx', 
//     inventory: [
//         { item: { id: '1' }, quantity: 2},
//         { item: { id: '2' }, quantity: 4},
//     ] 
// });
// accounts.createPlayer({ name: 'zielen2', pass: 'xxx' });
// accounts.createPlayer({ name: 'zielen3', pass: 'xxx' });
// accounts.createPlayer({ name: 'zielen4', pass: 'xxx' });
// accounts.createPlayer({ name: 'zielen5', pass: 'xxx', money: 100 });
// accounts.createAdmin({ id: '123', name: 'admin1', pass: 'xxx' })


// cmd.use({ type: 'root' }, 'money_give', { player: game.players[0].id, amount: 3000, info: 'test' });
// console.log(game.players);
// cmd.use({ type: 'root' }, 'exp_give', { player: game.players[0].id, amount: 17275, info: 'test' });

// cmd.use({type: 'root'}, 'quests_create', { 
//     id: '1', 
//     title: 'teścik', 
//     prizes: [
//         { type: 'money', amount: 30000}, 
//         { type: 'unknown', amount: 30000 },
//         { type: 'exp', amount: 2000 },
//         { type: 'item', item: '1', quantity: 4 },
//         { type: 'recipe', recipe: '1' },
//         {
//             type: 'random',
//             elements: [
//                 { chances: 1, prizes: [ { type: 'exp', amount: 1000000 }, { type: 'money', amount: 50000 } ] },
//                 { chances: 1, prizes: [ { type: 'money', amount: 1000000 } ] }
//             ]
//         }
//     ] 
// });


// console.log(cmd.use({ type: 'root' }, 'exp_getNeeded', { player: game.players[0].id }));

// accounts.createPlayer({ name: 'zielen6', pass: 'xxx', money: 100 });

// cmd.use({ type: 'root' }, 'eq_createItem', { name: 'młotek', id: '1' });
// cmd.use({ type: 'root' }, 'eq_createItem', { name: 'toporek', id: '2' });
// cmd.use({ type: 'root' }, 'eq_createItem', { name: 'siekierka', id: '3', prizes: [{ type: 'money', amount: 1000 }] });

// console.log(cmd.use({ type: 'root' }, 'prizes_give', { player: '1', prizes: [
//     { type: 'money', amount: 2000 },
//     { type: 'unknown', amount: 3000 },
//     { type: 'item', item: '1', amount: 2 }
// ] }));

// console.log(game.state.quests.list);
// console.log(game.players[0]);
setTimeout(()=>{
    // cmd.use({ type: 'root' }, 'quests_changeStatus', { player: '1', quest: '1', status: 'active' });
    // cmd.use({ type: 'root' }, 'quests_changeStatus', { player: '1', quest: '1', status: 'completed' });
    // cmd.use({ type: 'root' }, 'eq_giveItem', { player: '1', item: '3', quantity: 2 });
    try {
    // cmd.use(game.players[0], 'lootbox_open', { item: '3' });
    // cmd.use(game.players[0], 'lootbox_open', { item: '3' });
    // cmd.use(game.players[0], 'lootbox_open', { item: '3' });
    // cmd.use(game.players[0], 'lootbox_open', { item: '3' });
    // cmd.use({ type: 'root' }, 'gameSave');
    cmd.use({ type: 'root' }, 'gameLoad', {  save: '1606764879037' });
    console.log('save wczytany?');
    console.log(game);

    }
    catch(e){}
    // console.log(game.players[0]);


}, 1000);


// console.log(
//     cmd.use({ type: 'root' }, 'prizes_give', {
//         player: '1',
//         prizes: [
//             { 
//                 type: 'random', 
//                 elements: [
//                     { prizes: [ { type: 'money', amount: 3000 } ], chances: 33 },
//                     { prizes: [ { type: 'exp', amount: 3000 } ], chances: 66 }
//                 ] 
//             }
//         ]
//     })
// )


// console.log(game.state.inventory.items);
// cmd.use({ type: 'root' }, 'eq_giveItem', { item: '1', player: game.players[0], amount: 11 })
// cmd.use({ type: 'root' }, 'eq_giveItem', { item: '2', player: game.players[0], amount: 5 })
// cmd.use({ type: 'root' }, 'eq_giveItem', { item: '3', player: game.players[0], amount: 2 })
// cmd.use({ type: 'root' }, 'eq_giveItem', { item: '3', player: game.players[0], amount: 2 })

// console.log(cmd.use({ type: 'root' }, 'eq_hasItems', { player: game.players[0], items: [{ item: '1', amount: 3 }, { item: '2', amount: 4 }] }));
// console.log(game.players[0].inventory);

// console.log(cmd.list());
// console.log(game.state.quests.list);
// console.log(game.players[4]);
// console.log(game.players[5]);