// @flow
import * as React from 'react';
import * as RN from 'react-native';
import { Paragraph } from '../.';
import type { ParagraphType } from '../Paragraph';
// import type { PressEvent } from 'react-native/Libraries/Types/CoreEventTypes';

const style = {
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'column',
  userSelect: 'none',
  flex: 1,
  overflow: 'scroll',
  paddingBottom: '50%',
  paddingLeft: '10px',
  paddingTop: '10px',
  paddingRight: '10px',
  background: '#404040',
  color: '#EEEECC',
  fontSize: '1em',
};

type Props = {
  content: ParagraphType[],
  selection: Selection,
  onKeyUp: SyntheticEvent<HTMLDivElement, KeyboardEvent> => void,
  onKeyDown: SyntheticEvent<HTMLDivElement, KeyboardEvent> => void,
  onTouchStart: SyntheticEvent<HTMLDivElement, MouseEvent> => void,
  onTouchEnd: SyntheticEvent<HTMLDivElement, MouseEvent> => void,
  onDrag: SyntheticEvent<HTMLDivElement, MouseEvent> => void,
  onFocused: boolean => void
}

type TextPaneReference = {
  focus?: () => void,
  getParagraphAt?: (number, number) => number,
  getCharacterAt?: (number, number) => number,
}

export type TextPaneType = {|
  content: ParagraphType[],
  selection: Selection,
  ref: TextPaneReference & Ref<HTMLElement>,
|}

function getParagraphAt(x: number, y: number, content: ParagraphType[]) {
  const point = { x, y };
  const dichotomy = ((start: number, end: number) => {
    if(start===end) return start;
    const middle = Math.floor((start+end)/2);
    const location = (content[middle].ref && content[middle].ref.getLocation) ? content[middle].ref.getLocation() : {x: 0, y: 0, height: 0, width: 0};
    if(point.y>location.y+location.height) return dichotomy(middle+1, end);
    return dichotomy(start, middle);
  });
  return dichotomy(0, content.length);
}

function TextPaneFunction({content = [], selection = {start: 0, end: 0},
  onKeyUp = () => {},
  onKeyDown = () => {},
  onTouchStart = () => {},
  onTouchEnd = () => {},
  onDrag = () => {},
  onFocused = () => {}
}: Props, ref: TextPaneReference & Ref<HTMLElement>) {
  ref.focus = () => ref.current ? ref.current.focus() : undefined;
  ref.getParagraphAt = (x, y) => getParagraphAt(x, y, content);
  ref.getCharacterAt = (x, y) => {
    const paragraph = content[getParagraphAt(x, y, content)];
    if(paragraph.ref && paragraph.ref.getCharacterAt) return paragraph.ref.getCharacterAt(x, y);
    return 0;
  };

  let count = 0;
  const children = content.map(paragraph => {
    const length = paragraph.content.length;
    const component = <Paragraph {...paragraph} selection={{
      start: count+length>=selection.start ? Math.max(0,selection.start-count) : 0,
      end: count+length>=selection.start ? Math.min(length, selection.end-count) : 0
    }} />;
    count+=length+1;
    return component;
  });
  if(RN.Platform.OS === 'web') {
    return (<div
      ref={ref}
      focusable={true}
      tabIndex='0'
      style={style}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseDown={onTouchStart}
      onMouseUp={onTouchEnd}
      onMouseMove={onDrag}
      onFocus={() => onFocused(true)}
      onBlur={() => onFocused(false)}
    >
      {children}
    </div>);
  } else {
    return (<RN.TextInput
      ref={ref}
      style={style}
      editable={false}
      onKeyPress={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onDrag}
      onFocus={() => onFocused(true)}
      onBlur={() => onFocused(false)}
    >
      {children}
    </RN.TextInput>);
  }
}

// const TextPane = React.forwardRef<Props, HTMLElement>(TextPaneFunction);
// TextPane.displayName = 'TextPane';
// export default TextPane;

export default TextPaneFunction;