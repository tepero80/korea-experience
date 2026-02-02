// Types
export interface EmojiNameResult {
  id: string;
  style: string;
  styleKo: string;
  emojis: string;
  description: string;
  vibe: string;
  bestFor: string[];
  alternatives: string[];
}

// Emoji mapping by letter and style
const EMOJI_MAPPINGS: { [key: string]: { cute: string[], cool: string[], elegant: string[] } } = {
  a: { cute: ['🍎', '🌸', '🎀', '🐰'], cool: ['⚡', '🔥', '🌟', '💎'], elegant: ['✨', '🌹', '💫', '🦋'] },
  b: { cute: ['🦋', '🍓', '🎈', '🌺'], cool: ['💣', '🎸', '⚔️', '🏆'], elegant: ['🎭', '🌷', '💐', '🕊️'] },
  c: { cute: ['🍰', '🌼', '🎂', '🐱'], cool: ['🎮', '🔮', '💀', '🎯'], elegant: ['👑', '🌙', '💍', '🎻'] },
  d: { cute: ['🍩', '🌻', '🎀', '🐶'], cool: ['🐉', '⚡', '🔱', '🎪'], elegant: ['💎', '🦢', '🌟', '🎼'] },
  e: { cute: ['🥚', '🌷', '🎉', '🐘'], cool: ['⚡', '🌊', '🔥', '🎲'], elegant: ['✨', '🦅', '🌌', '🎹'] },
  f: { cute: ['🌸', '🍓', '🦊', '🎀'], cool: ['🔥', '⚔️', '🎸', '🏴'], elegant: ['🦢', '🌹', '💫', '🎺'] },
  g: { cute: ['🍇', '🌺', '🎁', '🐨'], cool: ['⚡', '🎮', '🔫', '🏁'], elegant: ['💎', '🦚', '✨', '🎻'] },
  h: { cute: ['🍯', '🌼', '💝', '🐹'], cool: ['🔥', '⚔️', '🎸', '🏒'], elegant: ['🦋', '🌙', '💫', '🎼'] },
  i: { cute: ['🍦', '🌸', '💖', '🦄'], cool: ['⚡', '🔮', '❄️', '🎯'], elegant: ['✨', '💍', '🌟', '🎹'] },
  j: { cute: ['🍓', '🌺', '💕', '🐼'], cool: ['🎸', '⚔️', '🔥', '🎪'], elegant: ['💎', '🦋', '💫', '🎺'] },
  k: { cute: ['🎀', '🌷', '💗', '🐨'], cool: ['⚡', '🔱', '🎮', '🏆'], elegant: ['👑', '🌹', '✨', '🎻'] },
  l: { cute: ['🍋', '🌼', '💛', '🦙'], cool: ['⚡', '🔥', '🎸', '🏁'], elegant: ['🦢', '🌙', '💫', '🎼'] },
  m: { cute: ['🍈', '🌸', '💚', '🐭'], cool: ['🎮', '⚔️', '🔥', '🎯'], elegant: ['🌹', '💎', '✨', '🎹'] },
  n: { cute: ['🥜', '🌺', '🎀', '🐨'], cool: ['⚡', '🔮', '🎸', '🏒'], elegant: ['🦋', '🌟', '💫', '🎺'] },
  o: { cute: ['🍊', '🌼', '🧡', '🦉'], cool: ['🔥', '⚔️', '🎮', '🎪'], elegant: ['💍', '🌙', '✨', '🎻'] },
  p: { cute: ['🍑', '🌸', '💗', '🐷'], cool: ['⚡', '🔱', '🎸', '🏆'], elegant: ['👑', '🦋', '💫', '🎼'] },
  q: { cute: ['🎀', '🌷', '💖', '🦄'], cool: ['👑', '⚡', '🔮', '🏁'], elegant: ['💎', '🌹', '✨', '🎹'] },
  r: { cute: ['🌹', '🍓', '💕', '🐰'], cool: ['🔥', '⚔️', '🎸', '🎯'], elegant: ['🦢', '🌟', '💫', '🎺'] },
  s: { cute: ['🍓', '🌺', '💖', '🐍'], cool: ['⚡', '🔥', '🎮', '🏒'], elegant: ['✨', '🦋', '💍', '🎻'] },
  t: { cute: ['🍊', '🌼', '💛', '🐯'], cool: ['⚡', '⚔️', '🔱', '🎪'], elegant: ['👑', '🌙', '💫', '🎼'] },
  u: { cute: ['🦄', '🌸', '💗', '☂️'], cool: ['⚡', '🔮', '🎸', '🏆'], elegant: ['💎', '🦢', '✨', '🎹'] },
  v: { cute: ['💝', '🌷', '💖', '🦊'], cool: ['⚡', '🔥', '🎮', '🏁'], elegant: ['🌹', '🦋', '💫', '🎺'] },
  w: { cute: ['🍉', '🌺', '💕', '🐋'], cool: ['⚔️', '🌊', '🎸', '🎯'], elegant: ['🦢', '🌟', '✨', '🎻'] },
  x: { cute: ['✖️', '🌼', '💗', '🦄'], cool: ['❌', '⚡', '🔥', '🏒'], elegant: ['✨', '💎', '💫', '🎼'] },
  y: { cute: ['🍋', '🌸', '💛', '🦙'], cool: ['⚡', '🔱', '🎮', '🎪'], elegant: ['👑', '🦋', '💍', '🎹'] },
  z: { cute: ['🦓', '🌷', '💖', '⚡'], cool: ['⚡', '🔥', '🎸', '🏆'], elegant: ['💎', '🌹', '✨', '🎺'] },
};

// Style definitions
const STYLES = {
  cute: {
    id: 'cute',
    name: 'Cute & Kawaii',
    nameKo: '귀여운 스타일',
    emoji: '🌸',
    description: 'Sweet, adorable emojis that make your name irresistibly cute!',
    vibe: 'Playful, sweet, and full of charm',
    bestFor: ['Instagram bio', 'Cute nicknames', 'Friendly profiles', 'K-pop fan accounts'],
  },
  cool: {
    id: 'cool',
    name: 'Cool & Edgy',
    nameKo: '쿨한 스타일',
    emoji: '⚡',
    description: 'Bold, powerful emojis that give your name an edgy vibe!',
    vibe: 'Confident, strong, and striking',
    bestFor: ['Gaming profiles', 'Bold statements', 'Cool usernames', 'Edgy aesthetics'],
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant & Classy',
    nameKo: '우아한 스타일',
    emoji: '✨',
    description: 'Sophisticated, graceful emojis that add elegance to your name!',
    vibe: 'Refined, sophisticated, and timeless',
    bestFor: ['Professional profiles', 'Elegant bios', 'Luxury brands', 'Classy aesthetics'],
  },
};

// Generate emoji name
export function generateEmojiName(name: string, style: 'cute' | 'cool' | 'elegant'): EmojiNameResult {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  if (cleanName.length === 0) {
    return {
      id: style,
      style: STYLES[style].name,
      styleKo: STYLES[style].nameKo,
      emojis: '🌟✨💫⭐🌙',
      description: 'Enter a name to see the magic!',
      vibe: STYLES[style].vibe,
      bestFor: STYLES[style].bestFor,
      alternatives: ['💖💝💕💗💓', '🌸🌺🌼🌻🌷', '⚡🔥✨💎👑'],
    };
  }

  // Generate main emoji name
  const emojis: string[] = [];
  for (let i = 0; i < cleanName.length && i < 5; i++) {
    const letter = cleanName[i];
    const mapping = EMOJI_MAPPINGS[letter] || EMOJI_MAPPINGS.a;
    const styleEmojis = mapping[style];
    emojis.push(styleEmojis[i % styleEmojis.length]);
  }

  // If name is shorter than 5, fill with style-appropriate emojis
  while (emojis.length < 5) {
    const fillerEmojis = style === 'cute' ? ['💖', '🌸', '✨', '💕', '🌟'] :
                        style === 'cool' ? ['⚡', '🔥', '💎', '⚔️', '👑'] :
                        ['✨', '💫', '🌙', '💍', '🦋'];
    emojis.push(fillerEmojis[emojis.length % fillerEmojis.length]);
  }

  // Generate alternative versions
  const alternatives: string[] = [];
  for (let variant = 0; variant < 3; variant++) {
    const altEmojis: string[] = [];
    for (let i = 0; i < cleanName.length && i < 5; i++) {
      const letter = cleanName[i];
      const mapping = EMOJI_MAPPINGS[letter] || EMOJI_MAPPINGS.a;
      const styleEmojis = mapping[style];
      altEmojis.push(styleEmojis[(i + variant + 1) % styleEmojis.length]);
    }
    while (altEmojis.length < 5) {
      const fillerEmojis = style === 'cute' ? ['🎀', '💝', '🌺', '🦄', '🍓'] :
                          style === 'cool' ? ['🎮', '🔮', '🎸', '🏆', '⚔️'] :
                          ['🌹', '👑', '🦢', '💎', '🎭'];
      altEmojis.push(fillerEmojis[altEmojis.length % fillerEmojis.length]);
    }
    alternatives.push(altEmojis.join(''));
  }

  const styleInfo = STYLES[style];

  return {
    id: style,
    style: styleInfo.name,
    styleKo: styleInfo.nameKo,
    emojis: emojis.join(''),
    description: `Your name "${name}" transformed into ${styleInfo.name.toLowerCase()} emojis!`,
    vibe: styleInfo.vibe,
    bestFor: styleInfo.bestFor,
    alternatives,
  };
}

// Get all styles for selection
export function getAllStyles() {
  return Object.values(STYLES);
}
