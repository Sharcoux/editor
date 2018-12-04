/* eslint-disable no-unused-vars */

const CONSONNE_ENTRE_VOYELLES = {
    condition: (i, {vowels, letters, word}) => (vowels[i-1] && !vowels[i] && vowels[i+1]),
    result: () => {
        return { create: true, safe: 2};
    },
    debug: 'consonne entre 2 voyelles => nouvelle syllabe',
};
const CONSONNES_INSEPARABLES = list => ({
    condition: (i, {vowels, letters, word}) => (list.indexOf(letters[i] + letters[i+1])>=0),
    result: () => {
        return { create: true, safe: 2};
    },
    debug: 'consonnes inséparables => nouvelle syllabe',
});
const CAS_ILLE = {
    condition: (i, {vowels, letters, word}) => (letters[i-2]==='i' && !letters[i-1]==='l' && letters[i]==='l' && letters[i+1]==='e'),
    result: (i, {vowels, letters, word}) => {
        if(letters[i-3]==='v') {
            //Les sons du type vil-le
            if(word.substring(0,8)!=='cheville' || word.substring(0,13)!=='recroqueville') {
                return { create: true, safe: 2};
            }
        } else if(letters[i-3]==='m' && i===3) {
            //Les sons du type mil-le
            return { create: true, safe: 2};
        }
        //Les autres sons (camomille, cheville...)
        return { create: false, safe: 2};
    },
    debug: 'son ille',
};
const CAS_ILLI = {
    condition: (i, {vowels, letters, word}) => (letters[i-2]==='i' && !letters[i-1]==='l' && letters[i]==='l' && letters[i+1]==='i'),
    result: (i, {vowels, letters, word}) => {
        if(word.substring(i-5, i+1)==='bouilli') {
            return { create: false, safe: 2};
        } else {
            //Les autres sons (millions, pilliers...)
            return { create: true, safe: 2};
        }
    },
    debug: 'son illi',
};
const DOUBLE_CONSONNES_ENTRE_VOYELLES = {
    condition: (i, {vowels, letters, word}) => (vowels[i-2] && !vowels[i-1] && !vowels[i] && vowels[i+1]),
    result: () => {
        return { create: true, safe: 2};
    },
    debug: '2 consonne entre 2 voyelles => nouvelle syllabe',
};
const TROIS_CONSONNES_CONSECUTIVES = {
    condition: (i, {vowels, letters, word}) => (vowels[i-3] && !vowels[i-2] && !vowels[i-1] && !vowels[i] && (vowels[i+1] || vowels[i+2]|| vowels[i+3])),
    result: () => {
        return { create: true, safe: 2};
    },
    debug: 'au moins 3 consonnes consécutives => nouvelle syllabe',
};
//Penser aux mots comme mêlée, bile, ...
const E_FINAL = {
    condition: (i, {vowels, letters, word}) => (i===letters.length-1 && letters[i]==='e'),
    result: () => {
        return { create: false, safe: 1};
    },
    debug: 'Le e final rejoint la dernière syllabe',
};
const MEME_SON = list => ({
    condition: (i, {vowels, letters, word}) => (list.indexOf(letters[i-1] + letters[i])>=0),
    result: () => {
        return { create: false, safe: 1};
    },
    debug: 'Son composé de 2 voyelles',
});
export const CAS_Y = {
    condition: (i, {vowels, letters, word}) => (vowels[i-1] && letters[i]==='y' && vowels[i+1]),
    result: ({elt}) => {
        return { create: true, safe: 1, special: elt};
    },
    debug: 'Le y partage 2 syllabes',
};
const TRIGRAMME_INDIVISIBLE = list => ({
    condition: (i, {vowels, letters, normalizedLetters}) => (list.indexOf(letters[i-2]+letters[i-1]+normalizedLetters[i])>=0),
    result: () => {
        return { create: false, safe: 1};
    },
    debug: `${list.join(', ')} sont inséparables`,
});
const DEUX_VOYELLES = {
    condition: (i, {vowels, letters, word}) => (vowels[i-1] && vowels[i]),
    result: () => {
        return { create: true, safe: 1};
    },
    debug: '2 voyelles apartiennent à 2 syllabes distinctes',
};
const inseparables = {
    default: ['bl', 'cl', 'fl', 'gl', 'pl', 'br', 'cr', 'dr', 'fr', 'gr', 'pr', 'tr', 'vr', 'ch', 'ph', 'gn', 'th'],
};
const trigrammes = {
    default: ['qui', 'que', 'gui', 'gue'],
    fr : ['qui', 'que', 'gui', 'gue', 'oui'],
};
const sounds = {
    fr: ['ai', 'aî', 'au', 'ea', 'ei', 'eo', 'eu', 'eû', 'oe', 'oi', 'oî', 'ou', 'où', 'oû'],
    en: ['ai', 'au', 'ee', 'ea', 'oo', 'ou']
};
export default {
    fr: [
        CONSONNE_ENTRE_VOYELLES,
        CONSONNES_INSEPARABLES(inseparables['default']),
        CAS_ILLE,
        CAS_ILLI,
        DOUBLE_CONSONNES_ENTRE_VOYELLES,
        TROIS_CONSONNES_CONSECUTIVES,
        E_FINAL,
        MEME_SON(sounds['fr']),
        CAS_Y,
        TRIGRAMME_INDIVISIBLE(trigrammes['default']),
        DEUX_VOYELLES,
    ],
    en: [
        CONSONNE_ENTRE_VOYELLES,
        CONSONNES_INSEPARABLES(inseparables['default']),
        CAS_ILLE,
        CAS_ILLI,
        DOUBLE_CONSONNES_ENTRE_VOYELLES,
        TROIS_CONSONNES_CONSECUTIVES,
        E_FINAL,
        MEME_SON(sounds['en']),
        CAS_Y,
        TRIGRAMME_INDIVISIBLE(trigrammes['default']),
        DEUX_VOYELLES,
    ],
};
