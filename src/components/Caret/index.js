// @flow
import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';

const style = {
  borderLeftColor: '#000000',
  borderLeftWidth: 'thin',
  borderLeftStyle: 'solid',
  height: '1em',
  width: '1px',
  display: 'inline',
};

type Props = {
  visible: boolean,
  inputStyle: {},
}

const Caret = ({ visible = true, inputStyle = {} }: Props) =>
  visible ? (<View style={Object.assign({}, style, inputStyle)}></View>) : null;

Caret.propTypes = {
  visible: PropTypes.boolean,
  inputStyle: PropTypes.object
};

export default Caret;
