const R = require('ramda');

module.exports = api =>{ 
    const give = R.pipe(
        api.accounts.$getPlayerOrThrow('player'),
        (o)=>({ ...o, amount: o.amount*1 }),
        api.register.load('money_beforeGive'),
        R.tap(({amount})=>{ if(typeof amount !=='number'){ throw new Error(api.game.i18n.money.$MoneyNoNumber); } }),
        R.tap(({player, amount})=>api.accounts.update(player, { money: player.money+amount })),
        api.register.load('money_afterGive'),
        ({player})=>player.money
    )
    api.register.add('playerBeforeAdd', player=>({ money: api.game.state.money.startsWith, ...player }));
    api.cmd.register('money_give', ({payload})=>give(payload), api.accounts.isAdmin);
}