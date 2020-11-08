const R = require('ramda');
module.exports = api =>{
    api.onPluginsReady(plugins=>{
        api.cmd.register(
            'prizes_giveRandom', 
            R.pipe(
                ({payload})=>payload,
                api.accounts.$getPlayerOrThrow('player'),
                o=>({...o, picked: plugins.random.get(o.elements)  }),
                o=>({ ...o, results: api.cmd.use({ type: 'root' }, 'prizes_give', { prizes: o.picked.prizes, player: o.player }).results }),
            ), 
            api.accounts.isAdmin
        );
        plugins.prizes.addPrizeType('random', 'prizes_giveRandom');
    
    })
}
