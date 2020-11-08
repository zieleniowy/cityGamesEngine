const R = require('ramda');
module.exports = api =>{
    return {
        get: R.pipe(
            elements=>({ elements, max: R.reduce(R.add, 0, elements.map(el=>el.chances||1)) }),
            o=>({...o, rand: Math.ceil(Math.random()*o.max) }),
            o=>o.elements.find(element=>(o.rand-=element.chances)<=0)||R.last(o.elements),
        )
    }
}