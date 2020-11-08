const R = require('ramda');
module.exports = api =>{
        // add prizes property to quests
        api.register.add('quests_beforeAdd', quest=>({ prizes: [], ...quest }));

        // give prizes after quest completion
        api.register.add('quests_afterStatusChange', R.tap(
            ({quest, player, status, prevStatus})=>(status==='completed'&&status!==prevStatus)?
            api.cmd.use({ type: 'root' }, 'prizes_give', {
                prizes: quest.prizes, player, source: { type: 'questCompleted', questId: quest.id } 
            }):null
        ));
    


}