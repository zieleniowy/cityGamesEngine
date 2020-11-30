import React from 'react';
import { makeStyles, List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, IconButton, Avatar, Menu, MenuItem } from '@material-ui/core';
import { MoreVert as MenuIcon } from '@material-ui/icons';
import Extensions from '../../components/Extensions';
import { useSelector } from 'react-redux';
import {path} from 'ramda';

const MoreButton = props =>{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleSelect = cb => () => {
        handleClose();
        cb(props.item);
    }
    return (
        <>
            <ListItemSecondaryAction>
                <IconButton onClick={handleClick}>
                    <MenuIcon />
                </IconButton>
            </ListItemSecondaryAction>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {props.actions.map(action=>(
                    <MenuItem key={action.id} onClick={handleSelect(action.onSelect)}>{ path(action.label, props.i18n) }</MenuItem>
                ))}
            </Menu>
        </>
        )
}



export default props => {
    const data = { items: props.items, data: props.data };
    const { proto, i18n, extensions } = useSelector(state=>({
        proto: state.inventory?.items||{},
        i18n: state.i18n,
        extensions: state.inventory?.extensions||{}    }))
    return (
        <div>
            <Extensions data={data} extensions={extensions.beforeItemList}/>
            <Extensions data={data} extensions={props.extensions?.before}/>
            <List>
                {props.items.map(row=>{
                    const item = proto[row.item.id]||{};
                    const actionData = { ...row, proto: item };
                    const actions = (props.actions||[]).filter(action=>action.isPossible(actionData));
                    return (
                        <ListItem key={row.item.id}>
                            <ListItemAvatar><Avatar src={item.src}>{item.name?.slice(0, 2)}</Avatar></ListItemAvatar>
                            <ListItemText primary={`${row.quantity}x ${item.name||i18n.inventory.unknown}`} />
                            {Boolean(props.actions?.length)&&<MoreButton actions={actions} i18n={i18n} item={item} />}
                        </ListItem>
                        )
                    }
                )}
            </List>
            <Extensions data={data} extensions={props.extensions?.after}/>
            <Extensions data={data} extensions={extensions.afterItemList}/>

        </div>

    )
}