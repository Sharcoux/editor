import PropTypes from 'prop-types';
import { TextInput } from 'react-native';
import React, { useRef } from 'react';
import Paragraph, {proptype as paragraphProps} from 'components/Paragraph';

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

function Editor({content = [], selection = {start: 0, end: 0}, mutable = {},
  // onKeyUp = () => {},
  onKeyDown = () => {},
  onTouchStart = () => {},
  onTouchEnd = () => {},
  onDrag = () => {},
}) {
  const ref = useRef(null);
  mutable.location = ref.current ? ref.current.getBoundingClientRect() : {};
  mutable.focus = () => ref.current && ref.current.focus();

  let count = 0;
  const children = content.map((paragraph, index) => {
    const length = paragraph.content.length;
    const component = <Paragraph {...paragraph} selection={{
      start: (selection && index+count===selection.start) ? index : 0,
      end: (selection && index+count===selection.end) ? index : (selection && index+count<selection.end) ? length : 0
    }} />;
    count+=length;
    return component;
  });
  return (<TextInput
    ref={ref}
    style={style}
    editable={false}
    onKeyPress={onKeyDown}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    onTouchMove={onDrag}
    onFocus={() => mutable.focused = true}
    onBlur={() => mutable.focused = false}
  >
    {children}
  </TextInput>
  );

}

Editor.propTypes = {
  content: PropTypes.arrayOf(paragraphProps),
  onDrag: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  selection: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end : PropTypes.number.isRequired,
  }),
  mutable: PropTypes.object
};
