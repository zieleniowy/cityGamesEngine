module.exports = api =>{
    api.server.addComponent('server.js');
    const AddPrizes = api.admin.addComponent('AddPrizes.js', 'Add');
    const TextField = api.admin.addComponent('PrizeTextField.js', 'TextField');
    let types = [];
    if(api.arePluginsIncluded(['quests'])){
        api.server.addComponent('server_quests.js');
        api.admin.addExtension('quests.createExtensions', api.admin.addComponent('AddPrizesToQuest.js', 'AddPrizesToQuest'));
    }
    if(api.arePluginsIncluded(['random'])){
        api.server.addComponent('server_random_prize.js');
        api.admin.i18n({
            random: 'losowa nagroda',
            option: 'opcja',
            probability: 'prawdopodobieństwo',
        })
        types.push({
            id: 'random',
            component: api.admin.addComponent('RandomPrize.js', 'RandomPrize'),
            label: 'prizes.random'
        })
    }
    if(api.arePluginsIncluded(['inventory'])){
        types.push({
            id: 'item',
            component: api.admin.addComponent('ItemPrize.js', 'ItemPrize'),
            label: 'inventory.itemDenominator'
        });
    }
    if(api.arePluginsIncluded(['money'])){
        types.push({ 
            id: 'money', 
            component: TextField, 
            label: 'money.denominator', 
            props: {
                label: 'global.amount',
                k: 'amount',
            } 
        });
    }
    if(api.arePluginsIncluded(['exp'])){
        types.push({ 
            id: 'exp', 
            component: TextField, 
            label: 'exp.denominator', 
            props: { 
                label: 'global.amount',
                k: 'amount',

            } 
        });
    }
    api.server.addComponent('server_prizes.js');
    api.admin.setState({
        // e.g. { type: 'money', component }
            types
    })
}