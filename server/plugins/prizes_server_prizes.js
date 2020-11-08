module.exports = api => {
    api.onPluginsReady(plugins=>{
        //[plugin, prize.type, command.name]
        [
            ['money', 'money', 'money_give'],
            ['exp', 'exp', 'exp_give'],
            ['inventory', 'item', 'eq_giveItem'],
            ['crafting', 'recipe', 'crafting_recipeLearn']
        ].forEach(arr=>{
            if(api.arePluginsIncluded([arr[0]])){
                plugins.prizes.addPrizeType(arr[1], arr[2])
            }
        })
    })
}