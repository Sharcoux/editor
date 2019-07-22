// @flow
import * as React from 'react';
import * as RN from 'react-native';
import { Letter } from '../.';
import type { Layout } from 'react-native/Libraries/Types/CoreEventTypes';
import type { LetterType } from '../Letter';

const defaultStyle = {
  display: 'block',
  userSelect: 'none',
  fontSize: '1em',
  whiteSpace: 'pre-wrap',
};

type ParagraphReference = {
  getLocation?: () => Bounds,
  getCharacterAt?: () => number,
  getContent?: ({start: number, end: number}) => LetterType[],
}

type Props = {
  content: LetterType[],
  style: Style,
  selection: Selection,
}

export type ParagraphType = {
  content: LetterType[],
  style: Style,
  ref: ParagraphReference & Ref<HTMLElement>
}

function getCharacterAt(x = 0,  y = 0, content: LetterType[]) {
  const point = { x, y };
  const dichotomy = ((start: number, end: number) => {
    if(start===end) return start;
    const middle = Math.floor((start+end)/2);
    const location = (content[middle].ref && content[middle].ref.getLocation) ? content[middle].ref.getLocation() : {x: 0, y: 0, height: 0, width: 0};
    if(point.y<location.y) return dichotomy(start, middle);
    if(point.y>location.y+location.height) return dichotomy(middle+1, end);
    if(point.x<location.x+location.width/2) return dichotomy(start, middle);
    return dichotomy(middle+1, end);
  });
  return dichotomy(0, content.length);
}

function ParagraphFunction({content = [], style = {}, selection = { start: 0, end: 0 }}: Props, ref: ParagraphReference & Ref<HTMLElement> = {}) {
  ref.getContent = ({start = 0, end = content.length} = {}) => {
    if(start>end) return ref.getContent ? ref.getContent({start: end, end: start}) : [];
    return content.slice(Math.max(0, start), Math.min(end, content.length));
  };
  ref.getCharacterAt = (x, y) => getCharacterAt(x, y, content);

  const finalStyle = Object.assign({}, defaultStyle, style);
  const children = content.map((letter, index) => (
    <Letter ref={letter.ref} key={index} {...letter} selected={selection && index>=selection.start && index<selection.end} />
  ));

  if(RN.Platform.OS === 'web') {
    ref.getLocation = () => {
      const rect = ref.current ? ref.current.getBoundingClientRect() : ({ height: 0, width: 0, x: 0, y: 0 }: Bounds);
      return ({
        x: rect.left!==undefined ? rect.left : rect.x,
        y: rect.top!==undefined ? rect.top : rect.y,
        width: rect.width,
        height: rect.height,
      }: Bounds);
    };
    return (<div
      ref={ref}
      style={finalStyle}>
      {children}
    </div>
    );
  } else {
    const location: Ref<Layout> = React.useRef(null);
    ref.getLocation = () => location.current || ({ height: 0, width: 0, x: 0, y: 0 }: Bounds);
    return (<RN.Text
      onLayout={({nativeEvent}) => location.current = nativeEvent.layout}
      style={finalStyle}>
      {children}
    </RN.Text>
    );
  }
}

//TODO : Analyse letters to create spans for similarily styled letters
//TODO : think of a way to group letters

// const Paragraph = React.forwardRef<Props, HTMLElement>(ParagraphFunction);
// Paragraph.displayName = 'Paragraph';
// export default Paragraph;

export default ParagraphFunction;
