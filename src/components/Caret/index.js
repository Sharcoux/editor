import React from 'react';
import { View } from 'react-native';

const style = {
  borderLeftColor: '#000000',
  borderLeftWidth: 'thin',
  borderLeftStyle: 'solid',
  height: '1em',
  width: '1px',
  display: 'inline',
}

export default props => props.visible ? (<View style={style}></View>) : null;