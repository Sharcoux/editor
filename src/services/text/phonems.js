/* eslint-disable no-unused-vars */

function applyToTextNodes(root, callback) {
    function treatNode(node) {
        const clone = $(node.outerHTML).html('');
        if(!node.hasChildNodes()) {
            const sentence = node.wholeText;
            if(!sentence) return clone;
            callback(node);
        } else {
            Array.from(node.childNodes).forEach(child => clone.append(treatNode(child)));
            return clone;
        }
    }
    treatNode(root);
}

const SOUND_A = {
    condition: (i, {vowels, letters, word}) => {
        if(letters[i]==='a') return 1;
    },
    sound: 'a',
    name: 'A',
};
const SOUND_AN = {
    condition: (i, {vowels, letters, word}) => {
        //mots en ement, iment sauf aiment
        if('ei'.includes(letters[i-2]) && letters[i-1]==='m' && letters[i]==='e' && letters[i+1]==='n' && letters[i+2]==='t' && word!=='aiment') return 2;
        //agent, gent
        if(letters[i]==='e' && (word==='agent' || word==='gent')) return 2;
        //en sauf enne, en+voyelle, ien, et les verbes en ent
        if(letters[i-1]!=='i' && letters[i]==='e' && letters[i+1]==='n' && ((letters[i+2] && !vowels[i+2]) || (letters[i+2]!=='n' || letters[i+3]!=='e'))) return 2;
        //an sauf ann et an+voyelle
        if(letters[i]==='a' && letters[i+1]==='n' && (!vowels[i+2] && letters[i+2]!=='n')) return 2;
        //amb, amp, emb, emp
        if('ea'.includes(letters[i]) && letters[i+1]==='m' && 'bp'.includes(letters[i+2])) return 2;
    },
    sound: 'ã',
    name: 'AN',
};
const SOUND_B = {
    condition: (i, {vowels, letters, word}) => {
        if(letters[i]==='b' && letters[i+1]) return 1;
    },
    sound: 'b',
    name: 'B',
};
const SOUND_D = {
    condition: (i, {vowels, letters, word}) => {
        if(letters[i]==='d' && letters[i+1]) return 1;
    },
    sound: 'd',
    name: 'D',
};
const SOUND_E = {
    condition: (i, {vowels, letters, word}) => {
        //oeu
        if(letters[i]==='o' && letters[i+1]==='e' && letters[i+2]==='u') return 3;
        //oe (comme oeil)
        if(letters[i]==='o' && letters[i+1]==='e') return 2;
        //œu
        if(letters[i]==='œ' && letters[i+1]==='u') return 2;
        //eu sauf eu
        if(letters[i]==='e' && 'uùû'.includes(letters[i+1]) && !['eu', 'eut', 'eus', 'eût'].includes(word)) return 2;
        //e final
        if(letters[i]==='e' && !vowels[i-1] && !letters[i+1]) return 1;
    },
    sound: 'ə',
    name: 'E',
};
const SOUND_ET = {
    condition: (i, {vowels, letters, word}) => {
        //mot et
        if(letters[i]==='e' && word==='et') return 2;
        //...er, ...ez
        if(letters[i]==='e' && 'rz'.includes(letters[i+1]) && !letters[i+2]) return 2;
        //ae (Laetitia)
        if(letters[i]==='a' && letters[i+1]==='e') return 2;
        //é,œ
        if('éœ'.includes(letters[i])) return 1;
    },
    sound: 'e',
    name: 'ET',
};
const SOUND_AI = {
    condition: (i, {vowels, letters, word}) => {
        //ette,
        if(letters[i]==='e' && i<letters.length-2 && !vowels[i+1] && !vowels[i+2]) return 1;
        //ai, ei sauf eil, ail et ein, ain non suivit d'une voyelle (geindre, gain, opposé à gaine, graine)
        if('ea'.includes(letters[i]) && letters[i+1]==='i' && letters[i+2]!=='l' && (letters[i+2]!=='n' || vowels[i+3])) return 2;
        //...et
        if(letters[i]==='e' && letters[i+1]==='t' && letters[i-1]) return 2;
        //ay
        if(letters[i]==='a' && letters[i+1]==='y') return 2;
        //è, ê, ë
        if('èêë'.includes(letters[i])) return 1;
        //eil (on considère que e->è et il->y)
        if(letters[i]==='e' && letters[i+1]==='i' && letters[i+2]==='l') return 1;
    },
    sound: 'ε',
    name: 'È',
};
const SOUND_UN = {
    condition: (i, {vowels, letters, word}) => {
        //ien sauf ien+n et ien+voyelle
        if(letters[i]==='i' && letters[i+1]==='e' && letters[i+2]==='n' && !vowels[i+3] && letters[i+3]!=='n') return 3;
        //ein, ain
        if('ea'.includes(letters[i]) && letters[i+1]==='i' && letters[i+2]==='n' && !vowels[i+3]) return 3;
        //in, un
        if('iu'.includes(letters[i]) && letters[i+1]==='n') return 1;
        //imp, imb, ump, ump
        if('iu'.includes(letters[i]) && letters[i+1]==='m' && 'bp'.includes(letters[i+2])) return 2;
    },
    sound: 'ɛ̃',
    name: 'UN',
};
const SOUND_F = {
    condition: (i, {vowels, letters, word}) => {
        //ph
        if(letters[i]==='p' && letters[i+1]==='h') return 2;
        //f
        if(letters[i]==='f' && (letters[i+1] || ['oeuf, boeuf, œuf, bœuf'].includes(word))) return 1;
        //oeuf, boeuf, œuf, bœuf
    },
    sound: 'f',
    name: 'F',
};
const SOUND_GU = {
    condition: (i, {vowels, letters, word}) => {
        //gu
        if(letters[i]==='g' && letters[i+1]==='u') return 2;
        //g sauf ge et gi et gn sauf gnou
        if(letters[i]==='g' && letters[i+1] && !'ei'.includes(letters[i+1]) && (letters[i+1]!=='n' || ['gnou','gnoux'].includes(word))) return 1;
        //second...
        if(letters[i]==='c' && word.startsWith('second')) return 1;
    },
    sound: 'g',
    name: 'G',
};
const SOUND_I = {
    condition: (i, {vowels, letters, word}) => {
        //i
        if(letters[i]==='i') return 1;
        //y sauf ay ey oy
        if(!'aeo'.includes(letters[i-1]) && letters[i]==='y') return 1;
    },
    sound: 'i',
    name: 'I',
};
const SOUND_Y = {
    condition: (i, {vowels, letters, word}) => {
        //ill sauf illi
        if(letters[i]==='i' && letters[i+1]==='l' && letters[i+2]==='l' && letters[i+3]!=='i') return 3;
        //eil, ail, eill, aill
        if(letters[i]==='i' && 'ae'.includes(letters[i-1]) && letters[i+1]==='l') return letters[i+2]==='l' ? 3 : 2;
    },
    sound: 'j',
    name: 'Y',
};
const SOUND_K = {
    condition: (i, {vowels, letters, word}) => {
        //qu
        if(letters[i]==='q' && letters[i+1]==='u') return 2;
        //ch + consonne
        if(letters[i]==='c' && letters[i+1]==='h' && !vowels[i+2]) return 2;
        //c sauf ce et ci et second
        if(letters[i]==='c' && !'ei'.includes(letters[i+1]) && !word.startsWith('second')) return 1;
        //k, q
        if('qk'.includes(letters[i])) return 1;
    },
    sound: 'k',
    name: 'K',
};
const SOUND_L = {
    condition: (i, {vowels, letters, word}) => {
        //l sauf eil et ail (et ill mais pris en compte ailleurs) / et sauf saoûl
        if(letters[i]==='l' && (!letters[i-1]==='i' || !'ae'.includes(letters[i-2])) && (letters[i+1] || word!=='saoûl')) return 1;
    },
    sound: 'l',
    name: 'L',
};
const SOUND_M = {
    condition: (i, {vowels, letters, word}) => {
        //m sauf am, em, om, um sauf mm, mb, mp ou m+voyelle, 
        if(letters[i]==='m' && (!vowels[i-1] || ('mbp'.includes(letters[i+1]) || vowels[i+1]))) return 1;
    },
    sound: 'm',
    name: 'M',
};
const SOUND_N = {
    condition: (i, {vowels, letters, word}) => {
        //n sauf an, en, on, un sauf nn, nb, np ou n+voyelle, 
        if(letters[i]==='n' && (!vowels[i-1] || ('mbp'.includes(letters[i+1]) || vowels[i+1]))) return 1;
    },
    sound: 'n',
    name: 'N',
};
const SOUND_O = {
    condition: (i, {vowels, letters, normalizedLetters}) => {
        //eau
        if(letters[i]==='e' && letters[i+1]==='a' && letters[i+2]==='u') return 3;
        //au
        if(letters[i]==='a' && letters[i+1]==='u') return 2;
        //o
        if(normalizedLetters[i]==='o') return 1;
    },
    sound: 'o',
    name: 'O',
};
const SOUND_ON = {
    condition: (i, {vowels, letters, word}) => {
        //on sauf onn et on+voyelle
        if(letters[i]==='o' && letters[i+1]==='n') return 2;
        //omb et omp
        if(letters[i]==='o' && letters[i+1]==='m' && 'bp'.includes(letters[i+2])) return 2;
    },
    sound: 'ɔ̃',
    name: 'ON',
};
const SOUND_P = {
    condition: (i, {vowels, letters, word}) => {
        //p sauf ph
        if(letters[i]==='p' && letters[i+1]!=='h') return 1;
    },
    sound: 'p',
    name: 'P',
};
const SOUND_R = {
    condition: (i, {vowels, letters, word}) => {
        //r sauf ...er
        if(letters[i]==='r' && (letters[i-1]!=='e' || letters[i+1])) return 1;
    },
    sound: 'r',
    name: 'R',
};
const SOUND_CH = {
    condition: (i, {vowels, letters, word}) => {
        //ch+voyelle
        if(letters[i]==='c' && letters[i+1]==='h' && vowels[i+2]) return 2;
        //sh
        if(letters[i]==='s' && letters[i+1]==='h') return 2;
    },
    sound: 'ʃ',
    name: 'CH',
};
const SOUND_GN = {
    condition: (i, {vowels, letters, word}) => {
        //gn sauf gnou/gnoux
        if(letters[i]==='g' && letters[i+1]==='n' && !['gnou','gnoux'].includes(word)) return 2;
        //sh
        if(letters[i]==='s' && letters[i+1]==='h') return 2;
    },
    sound: 'ɲ',
    name: 'GN',
};
const SOUND_S = {
    condition: (i, {vowels, letters, normalizedLetters}) => {
        //!voyelle+s
        if(!vowels[i-1] && letters[i]==='s') return 1;
        //s+consonne sauf h
        if(letters[i]==='s' && (letters[i+1] && letters[i+1]!=='h' && !vowels[i+1])) return 1;
        //TODO
        //         //ti non précédé de s ou d'un accent, pas dans un verbe,
        //         //tion, sauf cation et non précédé de 's' ou d'un accent
        //         if((letters[i-1]!=='s' && letters[i-1]!==normalize(letters[i-1])) && letters[i]==='t' && letters[i+1]==='i' && letters[i+2]==='o' && letters[i+3]==='n' && word!=='cation') return 2;
        //         //...tie (démocratie)
        //         if(letters[i]==='t' && letters[i+1]==='i' && letters[i+2]==='e') return 2;
        //         //dalmatien, martien, Laetitia
        //         if(letters[i]==='t' && letters[i+1]==='i' && 'aeo'.includes(letters[i+2]) && (letters[i+3]==='n' || !letters[i+3]) && word!=='cation') return 2;
        //ç
        if(letters[i]==='ç') return 1;
        //ce, ci
        if(letters[i]==='c' && 'ie'.includes(normalizedLetters[i+1])) return 1;
    },
    sound: 's',
    name: 'S',
};
const SOUND_T = {
    condition: (i, {vowels, letters, word}) => {
        //TODO
        //t sauf ...tien
        if(letters[i]==='t') return 1;
    },
    sound: 't',
    name: 'T',
};
const SOUND_OU = {
    condition: (i, {vowels, letters, word}) => {
        //ou
        if(letters[i]==='o' && letters[i+1]==='u') return 2;
    },
    sound: 'u',
    name: 'U',
};
const SOUND_V = {
    condition: (i, {vowels, letters, word}) => {
        //v
        if(letters[i]==='v') return 1;
        //w
        if(letters[i]==='w') return 1;
    },
    sound: 'v',
    name: 'V',
};
const SOUND_OI = {
    condition: (i, {vowels, letters, word}) => {
        //oi, oy et oî
        if(letters[i]==='o' && 'iîy'.includes(letters[i+1])) return 2;
        //parfois wa ?
    },
    sound: 'w',
    name: 'W',
};
const SOUND_U = {
    condition: (i, {vowels, letters, word}) => {
        if(letters[i]==='u' && !['eu', 'eut', 'eus', 'eût'].includes(word)) return 1;
    },
    sound: 'y',
    name: 'U',
};
const SOUND_Z = {
    condition: (i, {vowels, letters, word}) => {
        //z sauf ...ez (géré par ailleurs)
        if(letters[i]==='z') return 1;
        //voyelle + s + voyelle
        if(vowels[i-1] && letters[i]==='s' && vowels[i+1]) return 1;
    },
    sound: 'z',
    name: 'Z',
};
const SOUND_J = {
    condition: (i, {vowels, letters, word}) => {
        //ge, gi
        if(letters[i]==='g' && 'ei'.includes(letters[i+1])) return 2;
        //j
        if(letters[i]==='j') return 1;
    },
    sound: 'ʒ',
    name: 'J',
};

const phonems = [SOUND_A, SOUND_AI, SOUND_AN, SOUND_B, SOUND_CH, SOUND_D, SOUND_E,
    SOUND_ET, SOUND_F, SOUND_GN, SOUND_GU, SOUND_I, SOUND_J, SOUND_K, SOUND_L, SOUND_M,
    SOUND_N, SOUND_O, SOUND_OI, SOUND_ON, SOUND_OU, SOUND_P, SOUND_R, SOUND_S, SOUND_T,
    SOUND_U, SOUND_UN, SOUND_V, SOUND_Y, SOUND_Z];


export default phonems;
