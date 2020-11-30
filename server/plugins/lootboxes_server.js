const R = require('ramda');
module.exports = api => {
    // api.register.add('eq_beforeItemCreate', item=>({  ...item }))



    api.onPluginsReady(({inventory})=>{

        const throwIfItemNotOpenable = R.tap(payload=>{
            if(!api.either.fromNullable(payload.itemProto.prizes?.length).getOrElse(0)){
                throw new Error(api.game.i18n.lootboxes.$itemNotOpenable);
            }
        });

        const throwIfUserHasNoItem = R.tap(
            payload=>api.either.fromFalsify(
                inventory.hasItems({ player: payload.player, items: [{ item: payload.item, quantity: 1 }] }).bool
            ).getOrElseThrow(api.game.i18n.inventory.$dontHaveItem)
        )
        
        const removeLootbox = R.tap(payload=>inventory.giveItem({ player: payload.player, item: payload.item, quantity: -1 }));

        const open = R.pipe(
            api.accounts.$getPlayerOrThrow("player"),
            payload=>({...payload, itemProto: inventory.getItemFromState(payload.item).getOrElseThrow(api.game.i18n.inventory.$itemNotExists) }),
            throwIfItemNotOpenable,
            throwIfUserHasNoItem,
            api.register.load('lootbox_beforeOpen'),
            removeLootbox,
            (payload)=>({ 
                ...payload, 
                result: api.cmd.use(
                    { type:'root' }, 
                    'prizes_give', 
                    { player: payload.player, prizes: payload.itemProto.prizes }
                )
            }),
            api.register.load('lootbox_afterOpen')

        )
        api.cmd.register('lootbox_open', ({payload, subject})=>open({ ...payload, player: subject }), api.accounts.isPlayer);
    })

}