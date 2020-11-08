const Ramda = require('ramda');
const register = {}

const load = name=>arg=>register[name]?Ramda.pipe(...register[name])(arg):arg;

module.exports = {
    load,
    loadIf: (name, predicat)=>arg=>predicat(arg)?load(name)(arg):arg,
    add: (name, ...fns)=>{
        register[name] = !register.hasOwnProperty(name)?[...fns]:[...register[name],...fns];
    },
    list: ()=>Object.keys(register)
}