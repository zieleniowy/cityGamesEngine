module.exports = api => {
    api.server.addComponent('server.js');
    api.server.setState({ items: {} });

    api.admin.addComponent('clientFetchItemList.js', 'FetchItemList');
    api.player.addComponent('clientFetchItemList.js', 'FetchItemList');
    api.player.addComponent('ItemList.js', 'ItemList');
    const inventory = api.player.addComponent('PlayerInventory.js', 'Inventory');
    api.player.addToPage(inventory, '/');
    api.player.i18n({
        eq: "Ekwipunek",
        unknown: 'Przedmiot Nierozpoznany'
    })
}