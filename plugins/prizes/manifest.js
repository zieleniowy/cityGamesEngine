module.exports = api =>{
    api.server.addComponent('server.js');
    if(api.arePluginsIncluded(['quests'])){
        api.server.addComponent('server_quests.js');
    }
    if(api.arePluginsIncluded(['random'])){
        api.server.addComponent('server_random_prize.js');
    }
    api.server.addComponent('server_prizes.js');
}