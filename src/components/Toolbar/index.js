import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components';

const Bar = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: #777;
  border: 2px raised #CCC;
`;

const StyledButton = styled(TouchableOpacity)`
  height: 1.5em;
  width: 1.5em;
  padding: 0.2em;
  margin: 0.2em;
  border: 2px solid ${props => props.selected ? '#333' : 'transparent'};
  border-radius: 8px;
`;

const StyledText = styled(Text)`
  position: relative;
  top: -0.1em;
  left: 0.2em;
`;

class ToggleButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setSelected = this.setSelected.bind(this);
    this.state = { selected : false };
  }
  setSelected(bool) {
    this.setState({ selected: bool });
  }
  render() {
    const { style, value, updateStyle, removeStyle } = this.props;
    return (<StyledButton selected={this.state.selected} onPress={() => {
      this.setState({selected: !this.state.selected})
      this.state.selected ? removeStyle(Object.keys(style)[0]) : updateStyle(style)
    }}>
      <StyledText style={style}>{value}</StyledText>
    </StyledButton>);
  }
}

class Toolbar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.toggleButtons = {
      bold: { value: 'B', style: {fontWeight: 'bold'}},
      italic: { value: 'i', style: {fontStyle: 'italic'}},
      underline: { value: 'u', style: {textDecorationLine: 'underline'}},
      lineThrough: { value: 's', style: {textDecorationLine: 'line-through'}},
    };
    Object.values(this.toggleButtons).forEach(button => button.ref = React.createRef());
  }
  updateButtons(state) {
    Object.keys(this.toggleButtons).forEach(key => this.toggleButtons[key].ref.current.setSelected(state[key]));
  }
  render() {
    const { updateStyle, removeStyle } = this.props;
    return (<Bar>
      {Objects.keys(this.toggleButtons).map(key => {
        const params = this.toggleButtons[key];
        return (
          <ToggleButton key={key} value={params.value} style={params.style} removeStyle={removeStyle} updateStyle={updateStyle} />
        );
      })}
    </Bar>);
  }
}

export default Toolbar;