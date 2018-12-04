import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native';

const selectionStyle = {
  backgroundColor: '#202060',
  color: 'white'
};

function Letter({value = '', style = {}, selected = false, state = {}}) {
  function updateLocation(elt) {
    console.log(elt);
    //TODO using react-native api
    if(elt) state.location = elt.getBoundingClientRect();
  }
  const finalStyle = Object.assign({}, style, selected && selectionStyle);
  switch(value) {
    case '\n': return '\n';
    default: return (<Text onLayout={updateLocation} style={finalStyle}>{value}</Text>);
  }
}

Letter.propTypes = {
  selected: PropTypes.bool,
  state: PropTypes.object,
  style: PropTypes.object,
  value: PropTypes.string.isRequired
};

export default Letter;
export const proptype = Letter.PropTypes;