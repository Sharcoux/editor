import rules, { CAS_Y } from './rules';
import phonems from './phonems';

export function textToLetters(text) {
    const partToLetters = part => {
        if(part.word) return cutWord(part.value);
        return part.value.split('').map(elt => ({value: elt}));
    }
    splitWords(text).reduce((acc, part) => acc.concat(partToLetters(part)),[]);
}

export function lettersToGroups(letters) {
    letters.reduce((acc, letter) => {
        //Deep equal comparison
        if(JSON.stringify(letter.props)==JSON.stringify(previousProps)) {
            acc.currentGroup.letters.push(letter.value);
        } else {
            if(!acc.previousProps) acc.groups.push(acc.currentGroup);
            acc.previousProps = letter.props;
            acc.currentGroup = {letters: [letter.value], props: letter.props};
        }
    }, {previousProps: null, groups: [], currentGroup: {letters: [], style: {}}});
}

function splitWords(text) {
  const normalized = sentence.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, '').split(/\b/);
  const splitted = [];
  let i=0;
  //We need to split the real text according to the normalized text matches
  normalized.forEach(element => {
      const l = element.length;
      splitted.push(sentence.substr(i,l));
      i+=l;
  });
  if(splitted.length===0) return splitted;
  //We detect if the array is alternatively symbole+punctuation then word, or the other way around.
  const even = !!splitted[0].normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, '').match(/.*[a-z].*/);
  return splitted.map((elt,i) => !even ^ i%2 ? {value: elt} : {value: elt, word: true});
}

function cutWord(word, lang = 'fr') {
  const ruleSet = rules[lang] || rules['fr'];
  // const phonemSet = phonems[lang] || phonems['fr'];
  const phonemSet = phonems;

  const isVowel = letter => {
      return (['a','e','i','o','u','y']).indexOf(letter)>=0;
  };
  const letters = word.split('');
  const lowerLetters = letters.map(letter => letter.toLowerCase());
  const normalizedLetters = word.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, '').split('');
  const vowels = normalizedLetters.map(isVowel);

  const accumulator = {
      add(letter) {
          if(!this.sound) {
              //create unknown sound
              this.startSound();
          }
          this.sound.letters.push(letter);
          this.sound.remaining--;
          if(!this.sound.remaining) {
              this.endSound();
          }
          if(this.syllableStack) this.syllableStack--;
          logger('adding: ',letter);
      },
      syllables: [],
      sounds: [],
      syllableStack : 0,
      nextSyllable() {
          logger('nouvelle syllabe', this.syllableStack);
          this.syllables.push(this.sounds);
          this.sounds = [];
      },
      startSound({sound = 'unknown', length = 1, name = 'unknown'} = {}) {
          logger('sound', 'nouveau son', sound);
          this.sound = {
              remaining: length,
              letters: [],
              sound,
              name
          };
      },
      endSound() {
          logger('sound', 'fin du son', this.sound.sound);
          this.sounds.push(this.sound);
          delete this.sound;
      },
  };

  const params = {
      vowels,
      letters: lowerLetters,
      normalizedLetters,
      word,
  };

  const reducer = (acc, elt, i) => {
      if(acc.sound && acc.sound.remaining) {
          //On sait qu'on a un son en cours
          //On gère juste le y spécial
          if(lowerLetters[i]==='y' && CAS_Y.condition(i, params)) {
              acc.add(`<span class='pre-y ${MARK}'>${elt}</span>`);
              acc.syllableStack = 2;
              acc.nextSyllable();
              acc.add(`<span class='post-y ${MARK}'></span>`);
          } else {
              acc.add(elt);
          }
      } else {
          //On cherche si un son démarre
          let max = {
              length: 0,
              sound: '',
              name: '',
          };
          for(const rule of phonemSet) {
              const size = rule.condition(i, params);
              if(size && size>max.length) {
                  max = {length: size, sound: rule.sound, name: rule.name};
              }
          }
          logger('sound', i, elt, max.sound, max.name, max.length);
          if(max.length) {
              acc.startSound(max);
          }
          //On crée la première syllabe : on ajoute juste la lettre
          if(!acc.sounds.length) {
              //Si on est au cours d'une syllabe, on ajoute juste la lettre
              logger('rule', i, elt, 'première syllabe');
          } else if(acc.syllableStack) {
              //On sait qu'on peut ajouter la lettre sans vérification
              logger('rule', i, elt, 'lettre vérifiée', acc.syllableStack);
          } else {
              let found = false;
              for(const rule of ruleSet) {
                  if(rule.condition(i, params)) {
                      logger('rule', i, elt, rule.debug);
                      const syllable = rule.result(i, params);
                      acc.syllableStack = syllable.safe;
                      if(syllable.create) {
                          acc.nextSyllable();
                      }
                      found = true;
                      break;
                  }
              }
              if(!found) logger('rule', i, elt, 'aucune règle => ajouté à la syllabe suivante');
          }
          acc.add(elt);
      }
      return acc;
  };
  const result = letters.reduce(reducer, accumulator);
  result.nextSyllable();
  //create sound spans
  return result.syllables.reduce((acc, syllable, index) => {
      //On ajoute chaque lettre au tableau
      const sounds = syllable.map(sound => ({
          value: sound.letters.join(''),
          props: {
            class : {
                sound: sound.sound,
                soundName: sound.name,
                syllable: index,
                word: true,
            }
          }
      }));
      acc.concat(sounds);
      return acc;
  }, []);
}
