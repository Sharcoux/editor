import createDocument from 'models/Document';

export default () => ({
  inputStyle : DEFAULT_STYLE,
  document : createDocument();
})

class Document {
  setInputStyle(newStyle = {}, replace = 'false');
}

export function setInputStyle() {
  return 
}