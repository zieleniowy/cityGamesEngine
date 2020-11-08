const game = require('./game');
const register = require('./register');

let handle;

register.add('gameStart', ()=>{
    let timer = game.timer;
    let lastCheck = new Date()*1;
    handle = setInterval(()=>{
        let date = new Date()*1;
        let delta = date-lastCheck;
        if(delta>1000) { 
            timer.set(timer.get()+Math.floor(delta/1000));
            lastCheck = date;
        }
    }, 100);
})
register.add('gameStop', ()=>clearInterval(handle));
module.exports = {handle};