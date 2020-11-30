const R = require('ramda');
const game = require('../../server/bin/game');

module.exports = api =>{

const getItemFromState = item => api.either.fromNullable(typeof item === 'string'?api.game.state.inventory.items[item]:api.game.state.inventory.items[item.id]);

const shortenItem = R.pipe(
    (o)=>({ ...o, target: { id: o.source.id } }),
    api.register.load('eq_shortenItem')
) 

// const canItemsStack = R.pipe(
//     (o)=>({...o, returns: true }),
//     api.register.load('eq_canItemsStack'),
//     (o)=>o.returns
// )

const createItem = R.pipe(
    item=>({ id: api.genid(), name: 'default item', src: null, ...item }),
    api.register.load('eq_beforeItemCreate'),
    R.tap((item)=>{ api.game.state.inventory.items[item.id] = item; }),
    api.register.load('eq_afterItemCreate')
)
//trzeba sprawdzic czy nie mniej niz 0 i nie wiecej niz maxint
const giveItem = R.pipe(
    api.accounts.$getPlayerOrThrow("player"),
    (o)=>({ ...o, source: getItemFromState(o.item).getOrElseThrow(api.game.i18n.inventory.$itemNotExists) }),
    shortenItem,
    api.register.load('eq_beforeItemGive'),
    o=>({ ...o, stack: R.findIndex(R.propEq('item', o.target), o.player.inventory) }),
    R.tap(({player, target, quantity, stack})=>api.accounts.update(player, { 
            inventory: stack===-1?
                [...player.inventory, { item: target, quantity  }]
                :[...player.inventory.slice(0, stack), { item: target, quantity: player.inventory[stack].quantity+quantity }, ...player.inventory.slice(stack+1)]
    }))
)

// items: [{ item : item||string, quantity: number }] 

const hasItems = R.pipe(
    (o)=>({ ...o, source: o.items.map(el=>getItemFromState(el.item).getOrElseThrow(api.game.i18n.inventory.$itemNotExists)) }),
    (o)=>({ ...o, shortened: o.source.map(el=>shortenItem({ source: el }).target) }),
    ({items, shortened, player})=>shortened.map((shorten, index)=>(R.find(R.propEq('item', shorten), player.inventory)||{ quantity: 0 }).quantity>=items[index].quantity),
    (result)=>({ arr: result, bool: !result.some(R.not) })
)

    api.register.add('playerBeforeAdd', player=>({ inventory: [], ...player }))
    api.cmd.register('eq_createItem', ({payload})=>createItem(payload), api.accounts.isAdmin);
    api.cmd.register('eq_giveItem', ({payload})=>giveItem(payload), api.accounts.isAdmin);
    api.cmd.register('eq_hasItems', ({payload})=>hasItems(payload), api.accounts.isAdmin);
    api.cmd.register('eq_itemList', ()=>api.game.state.inventory.items, R.t);

    return {
        getItemFromState,
        hasItems,
        createItem,
        giveItem
    }
}