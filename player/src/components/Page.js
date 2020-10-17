import React from 'react';
import { connect } from 'react-redux'
import {Box} from '@material-ui/core';

function Page(props) {
    const content = Object.keys(props.components).filter(id=>props.components[id].pages.includes(props.page));
    return (
        <Box pb={12}>
            {
                content.map(id=>{
                    const Component = props.components[id].component;
                    return <Component key={id} />
                })
            }
        </Box>
    );
  }
  
  const mapStateToProps = (state) => ({ components: state.components });
  
  export default connect(mapStateToProps, null)(Page)
  