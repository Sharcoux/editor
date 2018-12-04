import PropTypes from 'prop-types';
import React from 'react';

const selectionStyle = {
  backgroundColor: '#202060',
  color: 'white'
};

function Letter({value = '', style = {}, selected = false, mutable = {}}) {
  function updateLocation(elt) {
    if(elt) mutable.location = elt.getBoundingClientRect();
  }
  const finalStyle = Object.assign({}, style, selected && selectionStyle);
  switch(value) {
    case '\n': return (<br ref={updateLocation} style={finalStyle}/>);
    default: return (<span ref={updateLocation} style={finalStyle}>{value}</span>);
  }
}

Letter.propTypes = {
  selected: PropTypes.bool,
  mutable: PropTypes.object,
  style: PropTypes.object,
  value: PropTypes.string.isRequired
};

export default Letter;
export const proptype = Letter.PropTypes;