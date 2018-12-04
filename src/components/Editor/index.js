import React, { useState, useRef } from 'react';
import Caret from 'components/Caret';
import Letter from 'components/Letter';
import Paragraph from 'components/Paragraph';
import EditorRenderer from 'components/EditorRenderer';

const defaultStyle = {
  color: "#000",
  fontSize: '1em',
}

const defaultParagraph = {
  content: [],
  style : {
    textAlign: 'left',
  },
}

function Editor() {
  const [content, setContent] = useState([]);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0
  })
  const [caret, setCaret] = useState(0);
  const inputStyle = useRef(defaultStyle);
  const shift = useRef(false);
  const pressed = useRef(false);

  function addParagraph(index) {
    const newP = Object.assign({}, defaultParagraph);
    const L = content.
    setContent(newP);
  }
}

class Editor extends React.PureComponent {
  addParagraph(index) {
    const pClone = [...this.state.paragraphs];
    pClone.splice(index, 0, {letters; })
    this.setState({
      paragraphs : [...this.state.paragraphs]
    })
  }
  isCaretVisible() {
    return this.getSelectionSize()===0 && this.focused;
  }
  getSelectionSize() {
    return this.state.selectionEnd - this.state.selectionStart;
  }
  getTargetPosition(event) {
    const {offsetX, offsetY, target} = event.nativeEvent;
    console.log(target);
    return 0;
    // //Cas d'un clic sur l'éditeur, mais pas sur un paragraph
    // if(this.editor.current && this.editor.current.isEqual(target)) {
    //   const index = this.getComponentAt(offsetX, offsetY);
    //   //Si on tombe sur un retour à la ligne, on prend le caractère précédent
    //   if(this.getLetter(index-1) && this.getLetter(index-1).value === '\n') return index-1;
    //   return index;
    // } else {
    //   //On trouve l'index de la lettre sur laquelle on a cliqué
    //   const targetIndex = Array.from(target.parentNode.children).indexOf(target);
    //   const index = targetIndex>=this.state.caret ? targetIndex-1 : targetIndex;
    //   const {x, width} = this.getCharLocation(index);
    //   console.log('target position :', this.state.caret, targetIndex, index);
    //   return (offsetX-x)*2>width ? index+1 : index; 
    // }
  }
  focus() {
    this.editor.current && this.editor.current.focus();
  }
  setSelection(start, end) {
    this.setState({
      selectionStart: Math.min(start, end),
      selectionEnd: Math.max(start, end),
      caret: end,
    });
  }
  setInputStyle(newStyle, replace) {
    const mergedStyle = replace ? newStyle : {...this.state.inputStyle, ...newStyle};
    this.setState({inputStyle: mergedStyle});
    if(this.getSelectionSize()) {
      this.state.letters.slice(this.state.selectionStart, this.state.selectionEnd)
        .forEach(letter => (letter.style = mergedStyle));
    }
    const style = this.getInputStyle();
    const state = {
      bold: style.fontWeight==='bold',
      italic: style.fontStyle==='italic',
      underline: style.textDecoration==='underline',
      lineThrough: style.textDecoration==='lineThrough',
      textAlign: style.textAlign
    }
    this.props.buttonUpdated();
  }
  getInputStyle() {
    return this.state.inputStyle;
  }
  getCaretPosition() {
    return this.state.caret;
  }
  getSelectionStart() {
    return this.state.selectionStart;
  }
  getSelectionEnd() {
    return this.state.selectionStart;
  }
  moveCaret(position, keepSelection) {
    this.setState({
      selectionStart: keepSelection ? Math.min(position, this.state.selectionStart) : position,
      selectionEnd: keepSelection ? Math.max(position, this.state.selectionEnd) : position,
      caret: position,
    });
  }
  getSelection(start = this.state.selectionStart, end = this.state.selectionEnd) {
    const pStart = this.getParagraphAt(start);
    const pEnd = this.getParagraphAt(end);
    const multiple = pStart !== pEnd;
    if(!multiple) return {
      multiple,
      paragraph : pStart,
      content : pStart.letter
    }
    return {
      multiple = p,
      start = 
    }
  }
  getComponentAt(x,  y) {
    const point = { x: 0, y: 0 };
    const dichotomy = ((start, end) => {
      if(start===end) return start;
      const middle = Math.floor((start+end)/2);
      const location = this.getCharLocation(middle);
      if(point.y<location.y) return dichotomy(start, middle);
      if(point.y>location.y+location.height) return dichotomy(middle+1, end);
      if(point.x<location.x+location.width/2) return dichotomy(start, middle);
      return dichotomy(middle+1, end);
    }).bind(this);
    return dichotomy(0, this.state.letters.length);
  }
  handleKeyUp(e) {
    const { key } = e.nativeEvent;
    switch(key) {
      case "Shift":
        this.setState({shift: false});
        break;
      default: break;
    }
  }
  getLetter(i) {
    if(i<=0) return this.state.paragraphs[0].letters[0];
    let sum = 0;
    let paragraphIndex = 0;
    while(sum<i) {
      const paragraph = this.state.paragraphs[paragraphIndex];
      if(!paragraph) {
        const letters = this.state.paragraphs[paragraphIndex-1].letters;
        return letters[letters.length-1];
      }
      sum+=paragraph.letters.length+1;
      paragraphIndex++;
    }
    const index = i+this.state.paragraphs[paragraphIndex].letters.length-sum-1;
    if(index<0) return NEW_PARAGRAPH;//Il s'agit du retour à la ligne qui a créé le paragraph
    return this.state.paragraphs[paragraphIndex].letters[index];
  }
  getParagraphAt(i) {
    if(i<=0) return 0;
    let sum = 0;
    let paragraphIndex = 0;
    while(sum<i) {
      const paragraph = this.state.paragraphs[paragraphIndex];
      if(!paragraph) return paragraphIndex-1;
      sum+=paragraph.letters.length+1;
      paragraphIndex++;
    }
    return paragraphIndex;
  }
  getCharLocation(i) {
    const index = Math.min(i,this.state.letters.length-1);
    const char = this.state.letters[index].ref.current.getLocation();
    const editor = this.editor.current.getLocation();
    return {
      x: char.x-editor.x,
      y: char.y-editor.y,
      width: char.width,
      height: char.height,
    }
  }
  handleKeyDown(e) {
    const { key, shiftKey, metaKey, ctrlKey, altKey } = e.nativeEvent;

    if(metaKey || ctrlKey || altKey) return;
    const move = ((arrow, shift) => {
      let position;
      switch(arrow) {
        case "ArrowRight": position = this.state.caret+1; break;
        case "ArrowLeft": position = this.state.caret-1; break;
        case "ArrowUp": {
          const location = this.getCharLocation(this.state.caret);
          position = this.getComponentAt(location.x, location.y-10);
          break;
        }
        case "ArrowDown": {
          const location = this.getCharLocation(this.state.caret);
          position = this.getComponentAt(location.x, location.y+location.height+10);
          break;
        }
        default: return; break;
      }
      this.moveCaret(position, shift);
    }).bind(this);
    switch(key) {
      case "Shift":
        this.setState({shift: true});
        break;
      case "Ctrl": break;
      case "Meta": break;
      case "Alt": break;
      case "CapsLock": break;
      case "Escape": break;
      case "Backspace":
        this.delete();
        break;
      case "Enter":
        this.insert('\n', DEFAULT_STYLE, shiftKey ? this.state.inputStyle : DEFAULT_STYLE);
        break;
      case "ArrowRight":
      case "ArrowLeft":
      case "ArrowUp":
      case "ArrowDown":
        move(key, shiftKey);
        break;
      default: this.insert(key, this.state.inputStyle); break;
    }
  }
  insert(letter = 'a', style = this.state.inputStyle, nextStyle) {
    const start = this.state.selectionStart;
    this.state.letters.splice(start, this.getSelectionSize(), {value: letter, style, ref:React.createRef()});
    this.moveCaret(this.state.selectionStart+1);
    if(nextStyle) this.setState({inputStyle: nextStyle});
    this.updateTags(this.getWordStart(start), this.getWordEnd(start+1));
  }
  delete() {
    const sel = this.getSelectionSize();
    if(!sel && this.state.caret===0) return;
    const start = this.state.selectionStart;
    if(sel) {
      this.state.letters.splice(start, sel);
      this.moveCaret(start);
    } else {
      this.state.letters.splice(start-1, 1);
      this.moveCaret(start-1);
    }
    this.updateTags(this.getWordStart(start), this.getWordEnd(start));
  }
  hasFocus() {
    return this.editor.current && this.editor.current.isFocusOwner();
  }
  handleTouchEnd(e) {
    if(!this.state.pressed) return;
    const position = this.getTargetPosition(e);
    this.setSelection(this.state.pressed, position);
    this.setState({ pressed: false });
  }
  handleTouchStart(e) {
    const position = this.getTargetPosition(e);
    this.setState({ pressed: position });
    this.moveCaret(position);
  }
  handleOut(e) {
    this.handleTouchEnd(e);
  }
  handleDrag(e) {
    if(!this.state.pressed) return;
    const position = this.getTargetPosition(e);
    this.setSelection(this.state.pressed, position);
  }
  getWordStart(index) {
    if(index===0) return 0;
    let result = Math.min(index, this.state.letters.length);
    while(result>=0 && this.state.letters[result].word) result--;
    return result+1;
  }
  getWordEnd(index) {
    const max = this.state.letters.length;
    if(index===max) return max;
    let result = index;
    while(result<max && this.state.letters[result].word) result++;
    return result;
  }
  getText(start, end) {
    return this.state.letters.slice(start, end).map(letter => letter.value).join('');
  }
  updateTags(start, end) {
    const text = this.getText(start, end);
  }
  render() {
    const { letters, selectionStart, selectionEnd } = this.state;
    const objectMap = letters.map((letter, index) => (<Letter ref={letter.ref} key={index} style={letter.style} value={letter.value} selected={index>=selectionStart && index<selectionEnd} />));
    //On ajoute le caret à la liste des objets à afficher
    objectMap.splice(selectionStart, 0, (<Caret visible={!this.getSelectionSize() && this.hasFocus()} key={'caret'}/>));
    const paragraphs = this.state.paragraphs.map(p => {
      return (<Paragraph style={p.style}>
      {}
    </Paragraph>})

    return (<EditorRenderer ref={this.editor} onKeyUp={this.handleKeyUp} onMouseLeave={this.handleLeave} onKeyDown={this.handleKeyDown} onDrag={this.handleDrag} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}>
      {objectMap}
    </EditorRenderer>)
  }
}

export default Editor;

/** Split style between paragraph style and character style */
function readStyle(style) {
  const { bold, }
}