module.exports = api => {
    if(api.arePluginsIncluded(['inventory', 'prizes'])){
        api.server.addComponent('server.js');
        // api.admin.addExtension('inventory.extensions.itemCreate', api.admin.addComponent('AddPrizes.js', 'AddPrizes'));
        // api.player.addComponent('addOpenAction.js')
    }
}