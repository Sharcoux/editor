// @flow
import * as React from 'react';
import * as RN from 'react-native';
import type { Layout } from 'react-native/Libraries/Types/CoreEventTypes';

const selectionStyle = {
  backgroundColor: '#202060',
  color: 'white'
};

type LetterReference = {
  getLocation?: () => Bounds,
}

type Props = {value: string, style: Style, selected: boolean}

export type LetterType = {|
  value: string,
  style: Style,
  ref: LetterReference & Ref<HTMLElement>,
  type: string,
|}

function LetterFunction({value = '', style = {}, selected = false }: Props = {}, ref: LetterReference & Ref<HTMLElement> = { current: null }) {
  const finalStyle = Object.assign({}, style, selected ? selectionStyle : {});
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
    switch(value) {
      case '\n': return (<br ref={ref} style={finalStyle}/>);
      default: return (<span ref={ref} style={finalStyle}>{value}</span>);
    }
  } else {
    const location: Ref<Layout> = React.useRef(null);
    ref.getLocation = () => location.current || ({ height: 0, width: 0, x: 0, y: 0 }: Bounds);
    switch(value) {
      case '\n': return '\n';
      default: return (<RN.Text ref={ref} onLayout={({nativeEvent}) => location.current = nativeEvent.layout} style={finalStyle}>{value}</RN.Text>);
    }
  }
}

// const Letter = React.forwardRef<Props, HTMLElement>(LetterFunction);
// Letter.displayName = 'Letter';
// export default Letter;

export default LetterFunction;
