const game = require('./game');
const register = require('./register');
const cmd = require('./commands');
const R = require('ramda');
const fs = require('fs');
const save = R.pipe(
    ()=>({}),
    register.load('beforeGameSave'),
    R.mergeDeepRight({game}),
    register.load('afterGameSaveMerge'),
    o=>new Promise((res, rej)=>fs.writeFile(`${game.env.savesDir}/${new Date()*1}.json`, JSON.stringify(o), err=>err?rej(err):res())),
    R.andThen(register.load('afterGameSave')),
    R.otherwise(register.load('saveGameError'))
)

const load = R.pipe(
    register.load('beforeGameLoad'),
    o=>({ data: JSON.parse(fs.readFileSync(`${game.env.savesDir}/${o.save}.json`, 'utf8')) }),
    register.load('afterGameSaveFileLoad'),
    R.tap(({data})=>Object.keys(data.game).forEach(key=>game[key]=data.game[key])),
    register.load('afterGameLoad')
)

register.add('saveGameError', R.tap(console.log));

cmd.register('saveGame', save, R.F);
cmd.register('loadGame', ({subject, payload})=>load(payload), R.F);

module.exports = {

}