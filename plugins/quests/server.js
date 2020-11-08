const R = require('ramda');
module.exports = api => {
    const quests = api.game.state.quests.list;
    const initial = quest=>R.mergeDeepRight({ 
        id: api.genid(), 
        title: 'default task',
        metaTitle: '',
        description: 'default task',
        show: {
            active: true,
            completed: true,
            failed: true,    
        },
        defaultStatus: 'inactive'
    }, quest);

    const $getOrThrow = path => o => {
        const p = path.split('.');
        const q = R.path(p, o);
        return R.assocPath(p, api.either.fromNullable(typeof q ==='string'?quests[q]:quests[q.id]).getOrElseThrow(api.game.i18n.quests.$questNotExists), o);
    }

    const addQuestToList = R.tap(quest=>api.game.state.quests.list[quest.id] = quest);
    const assignQuestToPlayer = R.tap(({ source, target, player })=>api.accounts.update(player, { quests: { [source.id]: R.mergeDeepRight(player.quests[source.id], target) }  }));

    const questAssignment = R.pipe(
        (o)=>({ ...o, target: { status: o.source.defaultStatus } }),
        api.register.load('quests_beforeAssignment'),
        assignQuestToPlayer,
        api.register.load('quests_afterAssignment')
    )
        
    const createQuest = R.pipe(
        initial, 
        api.register.load('quests_beforeAdd'), 
        addQuestToList,
        api.register.load('quests_afterAdd'),
        (quest)=>({ quest, assignments: api.game.players.map(player=>questAssignment({ source: quest, player })) }),
        api.register.load('quests_createCompleted'),
        ({quest})=>quest
    );
// player, quest, status
    const setQuestStatus = R.pipe(
        $getOrThrow('quest'),
        api.accounts.$getPlayerOrThrow('player'),
        (o)=>({ ...o, shouldUpdate: true, prevStatus: o.player.quests[o.quest.id].status }),
        api.register.load('quests_shouldStatusChange'),
        api.register.load('quests_beforeStatusChange'),
        R.tap(({ player, quest, status })=>api.accounts.update(player, { quests: { [quest.id]: { status } } })),
        api.register.load('quests_afterStatusChange')

    )




    api.register.add('playerBeforeAdd', player=>({ quests: {}, ...player}));
    api.register.add('playerBeforeAdd', R.tap((player)=>{
        Object.values(api.game.state.quests.list).forEach(quest=>{
            questAssignment({ source: quest, player });
        });
    }));


    api.cmd.register('quests_create', ({payload})=>createQuest(payload), api.accounts.isAdmin);
    api.cmd.register('quests_list', ()=>api.game.state.quests.list, R.t);
    api.cmd.register('quests_changeStatus', ({payload})=>setQuestStatus(payload), api.accounts.isAdmin);
}