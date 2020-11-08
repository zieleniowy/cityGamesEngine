const R = require('ramda');
module.exports = api =>{

    // this function should be moved to another file - not included only when quests plugin exists 
    const givePrize = R.pipe(
        api.register.load('prizes_beforeGive'),
        api.register.load('prizes_give'),
        api.register.load('prizes_afterGive')
    );
    const givePrizes = R.pipe(
        api.accounts.$getPlayerOrThrow('player'),
        ({player, prizes})=>({ player, prizes, results: prizes.map(prize=>givePrize({prize, player}).result) })
    )
    api.cmd.register('prizes_give', ({payload})=>givePrizes(payload), api.accounts.isAdmin);

    const addPrizeType = (type, command)=>api.register.add('prizes_give', o=>o.prize.type === type?{...o, result: api.cmd.use({ type: 'root' }, command, {...o.prize, player: o.player}) }:o);    

    return {
        addPrizeType
    }

}