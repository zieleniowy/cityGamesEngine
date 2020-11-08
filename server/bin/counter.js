const cmd = require('./commands');
const genid = require('./genid');
const Counter = function(initial){ 
    this.val = initial||0;
    this.commands = [];
}
Counter.prototype = {
    set(nVal){ 
        this.val = nVal; 
        this.execCommands();
    },
    get(){ return this.val; },
    wait(time, command, interval=false){
        const id = genid();
        this.commands.push({ target: this.val+time, time, command, id, interval });
        return id;
    },
    cancel(id){
        this.commands = this.commands.filter(command=>command.id!==id);
    },
    execCommands(){
        this.commands = this.commands.filter(o=>{
            if(o.target <= this.val){
                cmd.use(o.command.subject, o.command.command, o.command.payload);
                o.target += o.time;
                return o.interval;
            }
            return true;
        });
    },
}
module.exports = Counter;