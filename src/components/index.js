import React from 'react';
import LetterComponent from './Letter';
import ParagraphComponent from './Paragraph';
import TextPaneComponent from './TextPane';

export const Letter = React.forwardRef(LetterComponent);
Letter.displayName = 'Letter';

export const Paragraph = React.forwardRef(ParagraphComponent);
Paragraph.displayName = 'Paragraph';

export const TextPane = React.forwardRef(TextPaneComponent);
TextPane.displayName = 'TextPane';

