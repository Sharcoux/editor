const letterStyles = {color : '#000000', fontSize : '1em', fontWeight : 'normal', textDecoration : 'none', fontStyle : 'none'};

class LetterStyle {
  constructor(style = {}) {
    const self = this;
    Object.keys(letterStyles).forEach(key => if(style[key]!==letterStyles[key]) self[key] = style[key]);
    this.updateStyle = this.updateStyle.bind(this);
    this.getCSS = this.getCSS.bind(this);
  }
  updateStyle(style = {}) {
    Object.keys(letterStyles).forEach(key => if(this[key]!==style[key]) {
      if(style[key]===letterStyles[key]) delete this[key];
      else this[key] = style[key];
    });
  }
  getCSS() {
    return Object.keys(letterStyles).reduce((style, key) => {
      this[key] && this[key]!==letterStyles[key] && style[key] = this[key];
      return style;
    }, {});
  }
}

export LetterStyle;

const paragraphStyle = {textAlign: 'left'};
class ParagraphStyle {
  constructor(style = {}) {
    const self = this;
    Object.keys(paragraphStyle).forEach(key => if(style[key]!==paragraphStyle[key]) self[key] = style[key]);
    this.updateStyle = this.updateStyle.bind(this);
    this.getCSS = this.getCSS.bind(this);
  }
  updateStyle(style = {}) {
    Object.keys(paragraphStyle).forEach(key => if(this[key]!==style[key]) {
      if(style[key]===paragraphStyle[key]) delete this[key];
      else this[key] = style[key];
    });
  }
  getCSS() {
    return Object.keys(paragraphStyle).reduce((style, key) => {
      this[key] && this[key]!==paragraphStyle[key] && style[key] = this[key];
      return style;
    }, {});
  }
}

export ParagraphStyle;