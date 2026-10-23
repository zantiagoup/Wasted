// Demo answers for when there is no GEMINI_API_KEY. They let us walk the whole
// flow (scan, result, drop-off point, history) without Gemini. Every answer
// carries demo: true, so the Result screen says it is a sample.

// One sample per category we can find a drop-off point for. The aluminium one
// is below 70% on purpose, so the low-confidence warning can be seen too.
const SAMPLES = [
  {
    words: ['bottle', 'plastic', 'pet', 'botella', 'plástico'],
    name: 'Water bottle',
    category: 'PET',
    confidence: 92,
    description: 'Clear plastic, the kind drink bottles are made of.',
    steps: ['Rinse it', 'Take the cap off', 'Crush it']
  },
  {
    words: ['can', 'soda', 'aluminium', 'aluminum', 'lata'],
    name: 'Soda can',
    category: 'Aluminium',
    confidence: 64,
    description: 'Thin aluminium, it can be recycled again and again.',
    steps: ['Empty it', 'Rinse it', 'Crush it']
  },
  {
    words: ['glass', 'jar', 'vidrio', 'frasco'],
    name: 'Glass jar',
    category: 'Glass',
    confidence: 88,
    description: 'Clear glass from a food jar.',
    steps: ['Empty it', 'Take the lid off', 'Rinse it']
  },
  {
    words: ['box', 'cardboard', 'caja', 'cartón', 'carton'],
    name: 'Cardboard box',
    category: 'Cardboard',
    confidence: 95,
    description: 'Corrugated cardboard from a shipping box.',
    steps: ['Take the tape off', 'Flatten it', 'Keep it dry']
  },
  {
    words: ['battery', 'batteries', 'pila', 'batería'],
    name: 'AA battery',
    category: 'Hazardous',
    confidence: 90,
    description: 'Batteries have metals that must not end up in the trash.',
    steps: ['Tape the ends', 'Keep it apart', 'Take it to a collection point']
  }
];

// A typed description picks the sample whose words it mentions. A photo, or a
// description we do not recognise, takes the next sample in turn, so each
// scan shows something different.
let next = 0;

export async function demoClassify(text) {
  // A short wait, so the "Looking at it…" state shows like it would with Gemini.
  await new Promise(function (resolve) { setTimeout(resolve, 1200); });

  const lower = (text || '').toLowerCase();
  let sample = SAMPLES.find(function (s) {
    return s.words.some(function (word) { return lower.includes(word); });
  });

  if (!sample) {
    sample = SAMPLES[next % SAMPLES.length];
    next++;
  }

  return {
    name: sample.name,
    category: sample.category,
    confidence: sample.confidence,
    description: sample.description,
    steps: sample.steps,
    model: 'demo',
    demo: true
  };
}
