const R = require('ramda');
module.exports = api=>{
    const getPlayer = api.accounts.$getPlayerOrThrow('player');
    const hasEnoughExpToLevelUp = ({player, needed})=>player.exp>=needed;
/** 
* Summary Function used to provide an amount of exp needed for a player to level up
* @param {Object} payload test
* @param {(Object|string)} payload.player to get needed exp of
* @param {number} [payload.level] if not provided, fn will return the amount needed for player to get the next level
* @throws {Error} when there's no such a player
* @returns {number} of exp needed for a player to level up
*/
    const getNeeded = R.pipe(
        getPlayer,
        (o)=>{
            const c = api.game.state.exp.expTable;
            return { ...o, needed: c[o.level||o.player.level]||c[c.length-1] }
        },
        api.register.load('exp_beforeReturnRequired'),
        (o)=>o.needed
    );
/**
 * Check if player can level up
 * @param {object} payload
 * @param {(object|string)} payload.player
 * @fires getNeeded for getting amount of exp needed for a level up
 * @fires hasEnoughExpToLevelUp for checking if the amount is enough
 * @fires api.register.load('levelUp') - only if predicate is truly resolved
 */
    const lookForLevelUp = R.pipe(
        o=>({...o, needed: getNeeded(o) }),
        api.register.loadIf('levelUp', hasEnoughExpToLevelUp)
    )
/**
 * Level up a player, and then check if the player is able to level up next time
 * @fires register('exp_beforeLevelUp')
 * @fires register('exp_afterLevelUp')
 */
    const levelUp = R.pipe(
        getPlayer,
        api.register.load('exp_beforeLevelUp'),
        R.tap(({player, needed})=>api.accounts.update(player, { level: player.level+1, exp: player.exp-needed })),
        api.register.load('exp_afterLevelUp'),
        lookForLevelUp
    )
/**
 * Gives user a certain amount of exp and then ewentually process to leveling up
 * @param {object} payload
 * @param {(object|string)} payload.player
 * @param {number} payload.amount
 * @fires register('exp_beforeGive')
 * @fires register('exp_afterGive')
 * @desc can also fire these, if there's need to
 * @fires register('levelUp') - for internally use
 * @fires register('exp_beforeLevelUp')
 * @fires register('exp_afterLevelUp')
 */
    const give = R.pipe(
        getPlayer,
        (o)=>({ ...o, amount: o.amount*1  }),
        api.register.load('exp_beforeGive'),
        R.tap(({amount})=>{ if(typeof amount !=='number'){ throw new Error(api.game.i18n.exp.$expNoNumber); } }),
        R.tap(({player, amount})=>{ api.accounts.update(player, { exp: player.exp + amount }) }),
        api.register.load('exp_afterGive'),
        lookForLevelUp
    );
    api.cmd.register('exp_getNeeded', ({payload})=>getNeeded(payload));
    api.cmd.register('exp_give', ({payload})=>give(payload));

    api.register.add('levelUp', levelUp);
    api.register.add('playerBeforeAdd', player=>({ exp: 0, level: 0, ...player }));
    
}