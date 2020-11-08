module.exports = api =>{
    api.admin.addToPage(api.admin.addComponent('MoneyGive.js', 'Give'), '/');
    api.admin.i18n({
        transfer: "przelej gotówkę",
    });
    api.server.addComponent('server.js');
    api.server.setState({ startsWith: 1000 });

    const moneyStatus = api.player.addComponent('MoneyStatus.js', 'Status');

    if(api.arePluginsIncluded(['inventory'])){
        api.player.applyToState(state=>({
            inventory: {
                extensions: {
                    beforePlayerEq: [...(state.inventory?.extensions?.beforePlayerEq||[]), { id: 'moneyStatus', component: moneyStatus }]
                }
            }
        }))
    }
    else {
        api.player.addToPage(moneyStatus, '/');

    }
}