module.exports = api =>{
    api.admin.addToPage(api.admin.addComponent('MoneyGive.js', 'Give'), '/');
    api.admin.i18n({
        transfer: "przelej gotówkę",
        denominator: 'gotówka'
    });
    api.server.addComponent('server.js');
    api.server.setState({ startsWith: 1000 });

    const moneyStatus = api.player.addComponent('MoneyStatus.js', 'Status');

    if(api.arePluginsIncluded(['inventory'])){
        api.player.addExtension('inventory.extensions.beforePlayerEq', moneyStatus);
    }
    else {
        api.player.addToPage(moneyStatus, '/');
    }
}