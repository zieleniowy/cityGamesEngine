import React from 'react';
import {Money} from '@material-ui/icons';
import { useSelector } from 'react-redux';

const iconStyle = {verticalAlign: 'middle' };

export default props => {
    const money = useSelector(state=>state?.account?.money)
    return <span {...props }><Money style={iconStyle} />{money}</span>
}