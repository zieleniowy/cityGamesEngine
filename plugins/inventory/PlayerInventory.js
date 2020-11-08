import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Card, CardHeader, CardContent } from '@material-ui/core';
export default props => {
    const {items, Component, actions, i18n, extensions} = useSelector(state=>({
        items: state?.account?.inventory||[],
        Component: state.components.ItemList$inventory.component,
        actions: state.inventory?.actions?.itemOnList,
        i18n: state.i18n.inventory,
        extensions: state.inventory?.extensions||{}
    }));
    const parsedExtensions = { before: extensions.beforePlayerEq, after: extensions.afterPlayerEq };
    return (
        <Container>
            <Card>
                <CardHeader title={i18n.eq} />
                <CardContent>
                <Component extensions={parsedExtensions} actions={actions} items={items.filter(item=>item.quantity > 0)} />
                </CardContent>
            </Card>
        </Container>
    )
}