const fetchItems = store=>window.cmd('eq_itemList').then(
        items=>(store||window.store).dispatch({ type: "SET_PLUGIN_PROP", payload: {
            plugin: 'inventory',
            prop: 'items',
            value: items
        }
    })
)
window.onStoreReady(fetchItems);
export default fetchItems;