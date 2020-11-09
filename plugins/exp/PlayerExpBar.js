import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useSelector } from 'react-redux';

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box minWidth={35}>
        <Typography align="center" variant="body2" color="textSecondary">{props.label}</Typography>
      </Box>
      <Box width="100%" ml={1} mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
const useStyles = makeStyles(theme=>({
  root: {
    width: '100%',
    position: 'relative',
  },
  expAbsolute: {
      position: 'absolute',
      top: -theme.spacing(0.2),
      width: '100%',
  },
  expLabel: {
      background: 'rgba(255,255,255,.5)',
  }
}));

export default function LinearWithValueLabel() {
  const {exp, lvl} = useSelector(state=>({ exp: state.account?.exp || 0, lvl: state.account?.level || 0 }))
  const classes = useStyles();
  const [needed, setNeeded] = React.useState(Infinity);

  React.useEffect(()=>{
    window.cmd('exp_getNeeded').then(setNeeded);
  }, [lvl])

  const progress = Math.floor(exp/needed*100);
  return (
    <div className={classes.root}>
      <LinearProgressWithLabel label={lvl} value={progress} />
      <Typography className={classes.expAbsolute} align="center"><span className={classes.expLabel}>{exp} / {needed}</span></Typography>
    </div>
  );
}