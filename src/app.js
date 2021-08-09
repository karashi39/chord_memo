/* MODEL */
let testdata = {
  title: '赤とんぼ',
  musicby: '山田耕作',
  wordsby: '三木露風',
  chords: 'F|.BbF/A|Bb.Bbm6|F|DmAm7.|BbF.|Gm7Gm7/CC|F',
  words: '夕やけ|小やけの|赤とん|ぼ|負われて|見たのは|いつの日|か',
  beats: '3/4',
  bpl: 4, // bar per line
};

function chord() {
  return testdata;
}

/* LOGIC */
const BR = '\n'

function parse_cbar(bar, b = 4) {
  const str = bar.replace(/\//g, 'x').replace(/b/g, '♭');
  let beats = [];
  let beat = '';
  let onflg = false;
  let root = '/';
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === '.') {
      if (root !== '/') beat += root;
      beats.push(beat);
      beat = '';
      continue;
    }
    if (!onflg) {
      if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(str[i])) {
        beats.push(beat);
        beat = '';
      }
      if (str[i] === 'x') {
        onflg = true;
        continue;
      }
      beat += str[i];
    } else {
      if ( root === '/' || str[i] === 'b') {
        root += str[i];
      } else {
        beats.push(beat+root);
        beat = str[i];
        root = '/';
        onflg = false;
      }
    }
  }
  if (root !== '/') beat += root;
  beats.push(beat);
  beats.shift();
  while(true) {
    if (beats.length >= b) break;
    beats.push('');
  }
console.log(beats);
  return beats;
}

function chord_line(chord_array, i, bpl) {
  //const bars = chord_array.slice(i, i + bpl);
  const bars = chord_array.slice(i, i + bpl).map(bar => parse_cbar(bar, 3));
  return { type: 'chord', bars };
}

function word_line(word_array, i, bpl) {
  return { type: 'word', bars: word_array.slice(i, i + bpl) };
}

function parse_lines(words, chords, bpl = 4) {
  const wa = words.split('|');
  const ca = chords.split('|');
  if (wa.length != ca.length) return 'ERROR';

  let ret = [];
  for (let i = 0; i < wa.length; i += bpl) {
    ret.push(chord_line(ca, i, bpl));
    ret.push(word_line(wa, i, bpl));
    ret.push({ type: 'br' });
  }
  return ret;
}

/* VIEW */
const data = chord();
data.lines = parse_lines(data.words, data.chords, data.bpl);

const app = new Vue({
  el: '#app',
  data,
});
