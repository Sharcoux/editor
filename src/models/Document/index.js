import { ParagraphStyle, LetterStyle } from 'models/Style';

class Letter {
  /**
   * Create a new Letter with this value and optionnal style
   * @param {string} value 
   * @param {LetterStyle} style 
   */
  constructor(value = ' ', style = new LetterStyle()) {
    this.style = style;
    this.value = value;
    this.replace = this.replace.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.getValue = this.getValue.bind(this);
  }
  /**
  * Edit the paragraph style
  * @param newStyle {LetterStyle} The new style to apply
  * @param replace {boolean} A boolean indicating wether the new style should be merged or should erase completely the previous one
  */
  setStyle(newStyle = new LetterStyle(), replace = false) {
    this.style = replace ? newStyle : {...this.style, ...newStyle};
  }
  /**
   * @return {LetterStyle} the style of the letter
   */
  getStyle() {
    return this.style;
  }
  /**
   * Return the character denoted by this Letter
   * @return {string} the character
   **/
  getValue() {
    return this.value;
  }
}

export const NEW_PARAGRAPH = new Letter('\n');

class Paragraph {
  /**
   * Create a new paragraph with optionnal initial content
   * @param {Letter[]} initialContent The initial content
   * @param {ParagraphStyle} paragraphStyle The paragraphStyle
   */
  constructor(initialContent = [], paragraphStyle = new ParagraphStyle()) {
    this.letters = initialContent;
    this.style = paragraphStyle;
    this.replace = this.replace.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.getLength = this.getLength.bind(this);
    this.getLetter = this.getLetter.bind(this);
    this.getText = this.getText.bind(this);
    this.getStyle = this.getStyle.bind(this);
  }
  /**
  * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
  * @param offset {number} The zero-based location in the array from which to start removing elements.
  * @param length {number} The number of elements to remove.
  * @param insert {Letter[]} Elements to insert into the array in place of the deleted elements.
  */
  replace(offset = 0, length = 0, insert = []) {
    this.letters.splice(offset, length, insert);
  }
  /**
  * Edit the paragraph style
  * @param newStyle {ParagraphStyle} The new style to apply
  * @param replace {boolean} A boolean indicating wether the new style should be merged or should erase completely the previous one
  */
  setStyle(newStyle, replace) {
    this.style = replace ? newStyle : {...this.style, ...newStyle};
  }
  /**
   * Return the size of the paragraph in letters.
   * @return {number} the length
   **/
  getLength() {
    return this.letters.length;
  }
  /**
   * Return the Letter at specified index
   * @param {number} index the index
   * @return {Letter} the letter
   **/
  getLetter(index) {
    return this.letters[index];
  }
  /**
   * Return the Letters between specified indexes
   * @param {number} start from index
   * @param {number} end to index
   * @return {Letter[]} the letters
   **/
  getText(start, end) {
    return this.letters.slice(start, end);
  }
  /**
   * Return the style of the paragraph
   * @return {ParagraphStyle} the style of the paragraph
   */
  getStyle() {
    return this.style;
  }
}

class Document {
  /**
   * Create a new Document with an empty first paragraph.
   */
  constructor() {
    this.paragraphs = [new Paragraph()];
    this.addParagraph = this.addParagraph.bind(this);
    this.optimiseStyle = this.optimiseStyle.bind(this);
  }
  /**
   * Create a paragraph at specified index in the paragraphs list
   * @param {number} index index
   * @param {ParagraphStyle} style the style to apply to the paragraph
   */
  addParagraph(index = this.paragraphs.length, style = new ParagraphStyle()) {
    this.paragraphs.splice(index, 0, new Paragraph(style));
  }
  getParagraphAt(index) {
    if(index<=0) return this.paragraphs[0];
    let sum = 0;
    const paragraph = this.paragraphs.map(p => p.getLength()).findIndex(l => {
      sum+=(l+1);
      return sum>index;
    });
    return paragraph<0 ? this.paragraphs[this.paragraphs.length-1] : this.paragraphs[paragraph];
  }
  getLetterAndParagraphAt(index) {
    if(index<=0) return {
      pargraph: this.paragraphs[0],
      letter: this.paragraphs[0].getLetter(0),
    };
    let sum = 0;
    const paragraph = this.paragraphs.find(p => {
      sum+=(p.getLength()+1);
      return sum>index;
    });
    const indexInParagraph = index + paragraph.getLength() + 1 - sum;
    const letter = indexInParagraph === paragraph.getLength() ? NEW_PARAGRAPH : paragraph.getLetter(indexInParagraph);
    return { paragraph, letter, indexInParagraph }
  }
  getLetterAt(index) {
    return this.getLetterAndParagraphAt(index).letter;
  }
  /**
  * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
  * @param offset {number} The zero-based location in the array from which to start removing elements.
  * @param length {number} The number of elements to remove.
  * @param insert {Letter[]} Elements to insert into the array in place of the deleted elements.
  */
  replace(offset = 0, length = 0, insert = []) {
    const { start, indexInParagraph : startIndex } = this.getParagraphAt(offset);
    const { end, indexInParagraph : endIndex } = this.getParagraphAt(offset+length);
    const splitted = insert.reduce((acc, elt) => {
      elt === NEW_PARAGRAPH ? acc.push([]) : acc[acc.length-1].push(elt);
      return acc;
    }, [[]]);
    const temp = end.getText(endIndex, end.getLength());
    splitted[splitted.length-1].concat(temp);
    start.replace(startIndex, Math.min(start.getLength()-startIndex, length), splitted.shift());
    this.paragraphs.splice(start+1, end-start, splitted.map(letters => new Paragraph(letters, start.getStyle())));
  }

  optimiseStyle() {
    this.paragraphs.forEach(p => {
      p.letters.forEach(l => {
        const lStyle = map[JSON.stringify(l.getStyle().getCSS())];
        if(lStyle) l.style = lStyle;
        else map[JSON.stringify(l.getStyle.getCSS())] = l.getStyle();
      });
      const pStyle = map[JSON.stringify(p.getStyle().getCSS())];
      if(pStyle) p.style = pStyle;
      else map[JSON.stringify(p)] = p.getStyle();
    });
  }

  getHTML() {
    this.paragraphs.forEach(p => {
      p.letters.forEach(l => {
        
      })
    })
  }
}

const map = {};

export default () => new Document();
