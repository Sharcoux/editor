import PropTypes from 'prop-types';
import React from 'react';
import Letter, { proptype as letterProps } from 'components/Letter';
import { Text } from 'react-native';

const defaultStyle = {
  display: 'block',
  userSelect: 'none',
  fontSize: '1em',
  whiteSpace: 'pre-wrap',
};

function Paragraph({content = [], style = {}, mutable = {}, selection = { start: 0, end: 0 }}) {
  function updateLocation(elt) {
    console.log(elt);
    //TODO using react-native api
    if(elt) mutable.location = elt.getBoundingClientRect();
  }
  const finalStyle = Object.assign({}, defaultStyle, style);
  const children = content.map((letter, index) => (
    <Letter key={index} {...letter} selected={selection && index>=selection.start && index<selection.end} />
  ));
  return (<Text
    onLayout={updateLocation}
    style={finalStyle}>
    {children}
  </Text>
  );
}

Paragraph.propTypes = {
  selection: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end : PropTypes.number.isRequired
  }),
  content: PropTypes.arrayOf(letterProps).isRequired,
  mutable: PropTypes.object,
  style: PropTypes.object
};

export default Paragraph;
export const proptype = Paragraph.PropTypes;