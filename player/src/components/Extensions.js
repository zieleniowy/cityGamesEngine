import React from 'react';
export default props =>(props.extensions||[]).map(extension=><extension.component key={extension.id} {...props.data} />)