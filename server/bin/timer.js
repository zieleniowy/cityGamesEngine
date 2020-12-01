const game = require('./game');
const register = require('./register');
const cmd = require('./commands');
const genid = require('./genid');

let handle;


const execCommands = ()=>{
    const timer = game.timer;
    timer.commands = timer.commands.filter(o=>{
        if(o.target <= timer.val){
            cmd.rootUse(o.command, o.payload);
            o.target+=o.time;
            return o.interval;

        }
        return true;
    });
}


register.add('gameStart', ()=>{
    let lastCheck = new Date()*1;
    handle = setInterval(()=>{
        let timer = game.timer;
        let date = new Date()*1;
        let delta = date-lastCheck;
        if(delta>1000) { 
            timer.val = timer.val+Math.floor(delta/1000);
            lastCheck = date;
            execCommands();
        }
    }, 100);
})



register.add('gameStop', ()=>clearInterval(handle));
module.exports = {
    wait: (command, payload, time, interval=false)=>{
        const id = genid();
        const timer = game.timer;
        timer.commands.push({ target: timer.val+time, time, command, payload, id, interval });
        return id;
    },
    cancel(id){
        game.timer.commands = game.timer.commands.filter(command=>command.id!==id);
    }

}