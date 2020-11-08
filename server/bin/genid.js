let id = 1000;
module.exports = ()=>`${new Date()*1}${id++}`.slice(-16);