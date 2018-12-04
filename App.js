import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Toolbar from 'components/Toolbar';
import Editor from 'components/Editor';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
    this.setInputStyle = this.setInputStyle.bind(this);
    this.removeStyle = this.removeStyle.bind(this);
  }
  setInputStyle(style) {
    if(!this.editor.current) return;
    this.editor.current.setInputStyle(style);
    this.editor.current.focus();
  }
  removeStyle(style) {
    if(!this.editor.current) return;
    console.log(style);
    const oldStyle = {...this.editor.current.getInputStyle()};
    delete oldStyle[style];
    console.log(oldStyle);
    this.editor.current.setInputStyle(oldStyle, true);
    this.editor.current.focus();
  }
  render() {
    return (
      <View style={styles.container}>
        <Toolbar updateStyle={this.setInputStyle} removeStyle={this.removeStyle} />
        <Editor ref={this.editor} style={styles.editor}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  editor: {
    flex: 1
  }
});
