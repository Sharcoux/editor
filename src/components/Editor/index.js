// @flow
import * as React from 'react';
import * as RN from 'react-native';
import { TextPane } from '../.';
import type { TextPaneType } from '../TextPane';

type Document = {
  content: ParagraphType[],
  defaultStyle: Style,
  defaultParagraph: Paragraph,
  defaultLetter: Letter
}

type InputStyle = {
  inline: Style,
  paragraph: Style,
}

type Props = {
  onUpdate: () => void,
}

function defaultStyle(): Style {
  return {
    color: "#000",
    fontSize: '1em',
  };
};

function defaultParagraph(): ParagraphType {
  return {
    content: [],
    style: {
      textAlign: 'left',
      marginBottom: '0.5em',
    },
    ref: React.createRef(),
  }
};

function defaultLetter(): LetterType {
  return {
    value: '',
    style: {
      color: '#000000',
      fontSize: '1em',
    },
    ref: React.createRef(),
    type: "letter",
  };
};

function Editor({onUpdate}: Props, ref: Ref<HTMLElement>) {
  const [content: Paragraph[], setContent] = useState([defaultParagraph()]);
  const [selection: Selection, setSelection] = useState({
    start: 0,
    end: 0
  })
  const [caret: number, setCaret] = useState(0);
  const [focused: boolean, setFocused] = useState(false);
  const [inputStyle: InputStyle, setInputStyle] = useState(defaultStyle());
  
  const pressed = useRef(false);
  const shiftPressed = useRef(false);

  const editor = React.createRef();

  function fireEvent(event) {
    onUpdate(event);
  }

  /** Create a new instance of paragraph at the specified index */
  function addParagraph(index: number): void {
    const newP = defaultParagraph();
    //Add on last position if index is not provided
    if(index===undefined) setContent([...content, newP]);
    //Split current content in 2
    else {
      const previous = getContent({start: 0, end: index});
      const next = getContent({start: index, end: getSize()});
      setContent(previous.concat(newP, next));
    }
    setCaret(caret+1);
    fireEvent({type: "NEW_PARAGRAPH", index: index || getSize()-1});
  }

  const getSelectionSize = (): number => selection.end - selection.start;
  const isCaretVisible = (): boolean => getSelectionSize()===0 && focused;
  function updateFocus(b: boolean): void {
    setFocused(b);
    fireEvent({type: "FOCUS", focused: b});
  }

  /** Updates the caret position, and update the selection if needed. */
  function moveCaret(position: number, keepSelection: boolean): void {
    if(position<0) position = 0;
    const n = getSize();
    if(position>n) position = n;
    const newSelection = {
      start: keepSelection ? Math.min(position, selection.start) : position,
      end: keepSelection ? Math.max(position, selection.end) : position,
    };
    setSelection(newSelection);
    setCaret(position);
    fireEvent({type: "SELECTION", ...newSelection});
  }

  /** Update the inline style and the paragraph style with the provided elements */
  function updateInputStyle({inline = {}, paragraph = {}}: InputStyle = {}): void {
    Object.assign(inputStyle.inline, inline);
    Object.assign(inputStyle.paragraph, paragraph);
    if(getSelectionSize()>0) {
      getContent(selection).forEach(p => {
        p.style = {...p.style, ...paragraph};
        p.content.forEach(c => c.style = {...c.style, inline});
      });
    }
    fireEvent({type: "STYLE", ...selection, inline, paragraph});
  }

  /** Generate a document containing the selection */
  function getContent({start = 0, end = getSize()}: ?Selection = {}): Paragraph[] {
    let count = 0;
    return content.reduce((selected, p) => {
      if(start<=count && end>=count+p.content.length) selected.push(p);
      else if(start<count+p.content.length && end>count) {
        //Values relative to the paragraph
        const s = start - count;
        const e = end - count;
        const content = p.ref.getContent({start: s, end: e});
        selected.push({...p, content});
      }
      count+=p.content.length+1;
      return selected;
    }, []);
  }

  /** Get the current content size */
  function getSize(): number {
    //Except for the first one, new paragraphs count for 1 character
    return content.map(p => p.content.length).reduce((sum, size) => sum+size+1, -1);
  }

  /** Get the index in the document corresponding to the provided click location */
  function getTargetPosition(event): number{
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

  /** Retrieves the paragraph at the provided coordinates */
  function getParagraphAt(x: number,  y: number): Paragraph {
    return editor.ref.getParagraphAt(x,y);
  }

  /** Retrieves the character element at the provided coordinates */
  function getCharacterAt(x: number, y: number): Letter {
    return getParagraphAt(x, y).getCharacterAt(x, y);
  }

  /** Retrieves the character element at the provided index */
  function getLetter(index = caret) {
    let l = 0;
    const { content : pContent } = content.find(({content : pContent }) => {
      l+=pContent.length;
      return l>=index;
    });
    const i = index-(l-pContent.length);
    return i===pContent.length ? NEW_PARAGRAPH : pContent[i];
  }

  /** Retrieves the paragraph element at the provided index in the text */
  function getParagraphForLetter(index = caret): Paragraph {
    let l=0;
    return content.find(({content : pContent }) => {
      l+=pContent.length;
      return l>=index;
    });
  }

  /** Retrieves the paragraph and the character offset of the paragraph at specified index */
  function getParagraphOffsetForLetter(i = caret): number {
    let l=0;
    const paragraph = content.find(({content : pContent }) => {
      l+=pContent.length;
      return l>=i;
    });
    return l-paragraph.length;
  }

  /** Retrieves the location of the character element at the provided index */
  function getCharacterLocation(i = caret) {
    return getLetter(i).ref.getLocation();
  }

  /** Handle keys being released */
  function handleKeyUp(e): void {
    const { key } = e.nativeEvent;
    switch(key) {
      case 'Shift':
        shiftPressed.current = false;
        fireEvent({type: "SHIFTED", shifted: false});
        break;
      default: break;
    }
  }

  /** Insert an element into the document */
  function insertElement(value = '', index = caret, style: Style = {}, type = "letter") {
    const newLetter = defaultLetter();
    newLetter.value = { ...defaultLetter, value, style: {...defaultLetter.style, style}, type }
    const paragraph = getParagraphForLetter(index);
    const offset = getParagraphOffsetForLetter(index);
    paragraph.content = [
      ...paragraph.content.slice(0, index-offset),
      newLetter,
      ...paragraph.content.slice(index+offset+1, paragraph.content.length)
    ];
    setCaret(index+1);
    fireEvent({type: "INSERT", elements: getContent({start: index, end: index+1}), index, paragraph: content.indexOf(paragraph), offset});
  }

  /** Remove length element from the document, starting at index */
  function deleteContent(index: number = caret, length: number = 0) {
    const p1 = getParagraphForLetter(index);
    const p2 = getParagraphForLetter(index+length);
    //The removed part is within the same paragraph
    if(p1===p2) {
      const offset = getParagraphOffsetForLetter(index);
      p1.content = [
      ...p1.content.slice(0, index-offset),
      ...p1.content.slice(index+length-offset, p1.content.length)
      ];
      fireEvent({type: "DELETE", elements: p1.content.slice(index-offset, index+length-offset), index, paragraph: content.indexOf(p1), offset});
    } else {
      setContent([
      ...getContent({start: 0, end: index}),
      ...getContent({start: index+length, end: getSize()})
      ]);
      fireEvent({type: "DELETE", elements: getContent({start: index, end: index+length}), index, paragraph: content.indexOf(p1), offset});
    }
  }

  /** Short hand to delete the selection */
  function deleteSelection() {
    return deleteContent(selection.start, getSelectionSize());
  }

  /** Handle keys being pressed */
  function handleKeyDown(e): void {
    const { key, shiftKey, metaKey, ctrlKey, altKey } = e.nativeEvent;

    if(metaKey || altKey) {
      //TODO : handle alt plus arrow, meta + arrow, ctrl + arrow...
    } else if(ctrlKey) {//TODO : differentiate Windows+UNIX vs MacOS
      switch(key) {
        case "ArrowRight": moveCaret(caret+1, shiftKey); break;
        case "ArrowLeft": moveCaret(caret-1, shiftKey); break;
        case "ArrowUp": break;
        case "ArrowDown": break;
        case "C": break;//TODO : copy
        case "V": break;//TODO : paste
        case "X": break;//TODO : cut
        default: break;
      }
    } else {
      switch(key) {
        case "ArrowRight": moveCaret(caret+1, shiftKey); break;
        case "ArrowLeft": moveCaret(caret-1, shiftKey); break;
        case "ArrowUp": {
          const location = getCharacterLocation(caret);
          position = getCharacterAt(location.x, location.y-1);
          moveCaret(position, shiftKey);
          break;
        }
        case "ArrowDown": {
          const location = this.getCharLocation(caret);
          position = getCharacterAt(location.x, location.y+location.height+1);
          moveCaret(position, shiftKey);
          break;
        }
        case "Shift": shiftPressed.current = true; break;
        case "Ctrl": break;
        case "Meta": break;
        case "Alt": break;
        case "CapsLock": break;
        case "Escape":
          setSelection({start: caret, end: caret});
          break;
        case "Backspace":
          getSelectionSize() ? deleteSelection() : deleteContent(caret-1, 1);
          break;
        case "Suppr":
          getSelectionSize() ? deleteSelection() : deleteContent(caret, 1);
          break;
        case "Enter": {
            if(shiftKey || altKey) {
              insertElement('\n', caret, inputStyle);
            } else {
              addParagraph(caret);
            }
          }
          break;
        default: insertElement(key, caret, inputStyle); break;
      }
    }
  }

  function handleTouchEnd(e) {
    if(!pressed.current) return;
    pressed.current = false;
    const position = getTargetPosition(e);
    moveCaret(position, pressed.current);
  }
  function handleTouchStart(e) {
    const position = getTargetPosition(e);
    pressed.current = true;
    moveCaret(position, shiftPressed.current);
  }
  function handleOut(e) {
    handleTouchEnd(e);
  }
  function handleDrag(e) {
    if(!pressed.current) return;
    const position = getTargetPosition(e);
    moveCaret(position, pressed.current);
  }

  return <EditorView content={content} selection={selection}
    onKeyUp = {handleKeyUp}
    onKeyDown = {handleKeyDown}
    onTouchStart = {handleTouchStart}
    onTouchEnd = {handleTouchEnd}
    onDrag = {handleDrag}
    updateFocus = {updateFocus}
  />;
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

function cloneContent(content = []) {
  //Remove the references from the data to be cloned
  const clone = [...content.map(p => {...p, ref: React.createRef(), content: p.content.map(c => {...c, ref: React.createRef()})})];
  //Clone the other properties
  return JSON.parse(JSON.stringify(clone));
}