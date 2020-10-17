import React from 'react';
import {Popover} from '@material-ui/core';


export default props =>{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    
    return (
        <>
            {React.cloneElement(props.button, { onClick: handleClick })}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
            >
                {props.children}
            </Popover>
        </>
    )
}