module.exports = api => {
    api.server.addComponent('server.js');
    api.server.setState({ items: {} });

    api.admin.addComponent('clientFetchItemList.js', 'FetchItemList');
    api.admin.addToPage(api.admin.addComponent('ItemCreate.js', 'ItemCreate'), '/');
    api.admin.addComponent('ItemSelect.js', 'ItemSelect');

    api.player.addComponent('clientFetchItemList.js', 'FetchItemList');
    api.player.addComponent('ItemList.js', 'ItemList');

    const inventory = api.player.addComponent('PlayerInventory.js', 'Inventory');
    api.player.addToPage(inventory, '/');
    api.admin.setState({
        extensions: { itemCreate: [] }
    })
    api.admin.i18n({
        createItem: 'Stwórz przedmiot',
        itemName: 'nazwa przedmiotu',
        chooseItem: 'wybierz przedmiot',
        itemDenominator: 'Przedmiot'
    });
    api.player.i18n({
        eq: "Ekwipunek",
        unknown: 'Przedmiot Nierozpoznany'
    });
}