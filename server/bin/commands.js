const R = require('ramda');
const {dictionary} = require('./game');
const commands = { 
    // help: {
    //     predicate: R.T,
    //     fn: ({payload, subject})=>payload.command?
    //     true
    //     :Object.keys(help).filter(key=>canUse(subject, key)).map(key=>({ key, description: R.path(help[key].description.split, dictionary) })),  
    // },
};

const canUse = (subject, name, payload)=>subject?.type==='root'||Boolean(commands[name]?.predicate(subject, name, payload));


// const help = {};
//gettery, zeby obsluzyc zmiane slownika w locie... -> R.path(sciezka)(obiekt);

module.exports = {
    register(name, fn, predicate=R.T){
        commands[name]=commands[name]||{ fn, predicate };
    },
    canUse,
    use: (subject, name, payload)=>{
        if(canUse(subject, name, payload)){
            return commands[name].fn({ subject, payload })
        }
        throw new Error(dictionary.global.$noPrivileges);
    },
    list: ()=>Object.keys(commands)
    // setHelp(name, o){},
}