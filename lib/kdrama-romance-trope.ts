// Types
export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    scores: { [key: string]: number };
  }[];
}

export interface TropeResult {
  id: string;
  name: string;
  nameKo: string;
  emoji: string;
  tagline: string;
  description: string;
  storyline: string;
  iconicMoments: string[];
  representativeDramas: {
    title: string;
    year: number;
    leads: string;
  }[];
  yourScenario: string;
  romanticHighlights: string[];
  challenges: string[];
  happyEnding: string;
}

// Romance Tropes
export const romanceTropes: { [key: string]: TropeResult } = {
  chaebolgirl: {
    id: 'chaebolgirl',
    name: 'Rich Heir Meets Poor Girl',
    nameKo: '재벌과 가난한 여주',
    emoji: '💎',
    tagline: 'When wealth meets heart',
    description: 'You\'re drawn to the ultimate K-Drama classic: the collision of two worlds. A wealthy, seemingly cold heir falls for someone from a humble background who teaches them what really matters in life.',
    storyline: 'A privileged heir lives in luxury but feels empty inside. Enter you - someone genuine, hardworking, and unimpressed by money. Your refreshing honesty and warmth slowly melt their cold exterior. Despite family opposition and societal pressure, love conquers all class differences.',
    iconicMoments: [
      'The dramatic umbrella sharing in the rain',
      'Being saved from embarrassment at a high-society event',
      'The rooftop confession overlooking the city',
      'Sneaking away from bodyguards for a street food date',
      'The dramatic airport scene: "Don\'t go!"'
    ],
    representativeDramas: [
      { title: 'Boys Over Flowers', year: 2009, leads: 'Lee Min-ho & Ku Hye-sun' },
      { title: 'The Heirs', year: 2013, leads: 'Lee Min-ho & Park Shin-hye' },
      { title: 'Crash Landing on You', year: 2019, leads: 'Hyun Bin & Son Ye-jin' }
    ],
    yourScenario: 'You accidentally bump into a chaebol heir at a convenience store. They\'re rude at first, but when you save them from a scandal, they become fascinated by you. Family opposition intensifies, but their love for you only grows stronger. You teach them humility; they show you it\'s okay to dream big.',
    romanticHighlights: [
      'Piggyback rides after you twist your ankle',
      'They buy out the restaurant for a private date',
      'Wrist grabs during arguments (the classic!)',
      'Secret relationship hidden from their family',
      'Grand gesture: showing up in the rain'
    ],
    challenges: [
      'Disapproving wealthy parents',
      'Evil ex-fiancée plotting against you',
      'Paparazzi and public scrutiny',
      'Self-doubt about fitting into their world'
    ],
    happyEnding: 'After proving your love can overcome any obstacle, their family finally accepts you. You get married in a lavish wedding, but also keep your authentic self. Money didn\'t change you - you changed them for the better.'
  },

  childhoodfriends: {
    id: 'childhoodfriends',
    name: 'Childhood Friends to Lovers',
    nameKo: '소꿉친구',
    emoji: '🧸',
    tagline: 'They were always by your side',
    description: 'You cherish deep connections built over time. Your romance trope is the heartwarming journey from friendship to love - when you finally realize your best friend was "the one" all along.',
    storyline: 'You\'ve known each other since childhood, sharing every milestone. Years of inside jokes, secrets, and unconditional support blur the line between friendship and love. A moment of jealousy or near-loss makes you both realize: what you\'re looking for has been right there all along.',
    iconicMoments: [
      'The accidental almost-kiss that awakens feelings',
      'Getting jealous when they date someone else',
      'Finding old childhood photos together',
      'They remember tiny details about you no one else knows',
      'The confession: "I think I\'ve always loved you"'
    ],
    representativeDramas: [
      { title: 'Reply 1988', year: 2015, leads: 'Park Bo-gum & Hyeri' },
      { title: 'Fight for My Way', year: 2017, leads: 'Park Seo-joon & Kim Ji-won' },
      { title: 'Twenty-Five Twenty-One', year: 2022, leads: 'Nam Joo-hyuk & Kim Tae-ri' }
    ],
    yourScenario: 'You and your childhood friend have been inseparable for 20 years. Everyone thinks you\'re a couple, but you laugh it off. When they start dating someone, you feel an unexpected pang of jealousy. A tearful late-night conversation leads to the confession you\'ve both been avoiding.',
    romanticHighlights: [
      'Comfortable silences that speak volumes',
      'They know your coffee order by heart',
      'Playful bickering that\'s actually flirting',
      'Protective moments: "Nobody talks about them like that"',
      'Realizing all your best memories include them'
    ],
    challenges: [
      'Fear of ruining the friendship',
      'Taking each other for granted',
      'Others not taking your relationship seriously',
      'Navigating the transition from friends to romance'
    ],
    happyEnding: 'After years of friendship, you finally date. It feels natural, like coming home. Your wedding is filled with people who always knew you\'d end up together. You get the rare gift of marrying your best friend and soulmate.'
  },

  fatefulreunion: {
    id: 'fatefulreunion',
    name: 'Fateful Reunion',
    nameKo: '운명적 재회',
    emoji: '🌟',
    tagline: 'Destiny brought us back together',
    description: 'You believe in fate and second chances. Your trope is the emotional reunion with a first love or someone from your past, proving that true love always finds its way back.',
    storyline: 'Years ago, you were torn apart by circumstances beyond your control. Now, fate brings you back together - perhaps as colleagues, neighbors, or through a chance encounter. Old feelings resurface, but past wounds need healing. Can you overcome what separated you before?',
    iconicMoments: [
      'The breathtaking moment you recognize each other',
      'Flashbacks to your beautiful past together',
      '"I never forgot you" confession',
      'Visiting places from your shared memories',
      'Deciding to fight for love this time'
    ],
    representativeDramas: [
      { title: 'Autumn in My Heart', year: 2000, leads: 'Song Seung-heon & Song Hye-kyo' },
      { title: 'Goblin', year: 2016, leads: 'Gong Yoo & Kim Go-eun' },
      { title: 'Chocolate', year: 2019, leads: 'Yoon Kye-sang & Ha Ji-won' }
    ],
    yourScenario: 'Ten years ago, you had to part ways due to family circumstances. Now you\'re both back in Seoul. The moment your eyes meet at a coffee shop, time stops. All the unresolved feelings come flooding back. This time, you\'re both strong enough to fight for your love.',
    romanticHighlights: [
      'Tearful reunion: "It\'s really you..."',
      'Discovering they kept mementos of you',
      'Making up for lost time',
      'Slow-motion running into each other\'s arms',
      'Promising to never let go again'
    ],
    challenges: [
      'Unresolved past issues',
      'New relationships/obligations',
      'Fear of being hurt again',
      'Different life paths and goals'
    ],
    happyEnding: 'This time, nothing will separate you. You\'ve both grown and are ready for the love that was always meant to be. Your reunion proves that some loves are too strong to be forgotten, and destiny always has a plan.'
  },

  contractmarriage: {
    id: 'contractmarriage',
    name: 'Contract Marriage/Fake Dating',
    nameKo: '계약 결혼',
    emoji: '📝',
    tagline: 'Just business... until it wasn\'t',
    description: 'You love the thrill of forbidden feelings. Your trope is the delicious tension of a fake relationship that slowly becomes all too real. What started as convenience becomes undeniable love.',
    storyline: 'You enter a contractual relationship for practical reasons - inheritance, citizenship, reputation, or escaping pressure. Clear rules: no real feelings. But proximity breeds affection. Small gestures, unexpected jealousy, and genuine care make you question: when did this become real?',
    iconicMoments: [
      'The awkward contract signing scene',
      'Having to act like a couple in public',
      'Accidental bed-sharing: "I\'ll sleep on the couch"',
      'Getting genuinely jealous of their "fake" attention to others',
      'The confession: "These feelings aren\'t fake anymore"'
    ],
    representativeDramas: [
      { title: 'Full House', year: 2004, leads: 'Rain & Song Hye-kyo' },
      { title: 'My Lovely Sam Soon', year: 2005, leads: 'Hyun Bin & Kim Sun-a' },
      { title: 'Because This Is My First Life', year: 2017, leads: 'Lee Min-ki & Jung So-min' }
    ],
    yourScenario: 'You need to fake a relationship to solve a problem - maybe inheritance, visa issues, or escaping matchmaking. You both agree to strict rules and a time limit. But living together reveals their real personality. Domestic moments become dangerously comfortable. Pretending turns into reality.',
    romanticHighlights: [
      'Practicing couple poses and hand-holding',
      'They defend you when someone insults you',
      'Cooking breakfast together',
      'Accidental forehead kiss "for practice"',
      'Realizing you don\'t want the contract to end'
    ],
    challenges: [
      'Maintaining emotional distance',
      'What happens when the contract ends?',
      'Fear of one-sided feelings',
      'Outside forces threatening the arrangement'
    ],
    happyEnding: 'When the contract period ends, you both confess: it stopped being fake long ago. You tear up the contract and start a real relationship, built on the genuine connection you discovered while pretending.'
  },

  enemiestolovers: {
    id: 'enemiestolovers',
    name: 'Enemies to Lovers',
    nameKo: '앙숙에서 연인으로',
    emoji: '⚡',
    tagline: 'From hate to love',
    description: 'You thrive on passionate tension and witty banter. Your trope is the electric transformation from rivals who can\'t stand each other to lovers who can\'t live without each other.',
    storyline: 'You clash at first sight - competing for the same position, clashing personalities, or old grudges. Every interaction is verbal sparring. But forced proximity reveals unexpected common ground. Hate turns to grudging respect, then undeniable attraction. The line between love and hate was thinner than you thought.',
    iconicMoments: [
      'Heated arguments that end too close for comfort',
      'Forced to work together on a project',
      'Unexpected moment where they defend you',
      'Sexual tension during a debate',
      'The "shut up" kiss'
    ],
    representativeDramas: [
      { title: 'Secret Garden', year: 2010, leads: 'Hyun Bin & Ha Ji-won' },
      { title: 'My Girlfriend is a Gumiho', year: 2010, leads: 'Lee Seung-gi & Shin Min-ah' },
      { title: 'Touch Your Heart', year: 2019, leads: 'Lee Dong-wook & Yoo In-na' }
    ],
    yourScenario: 'You\'re competitors at work, always trying to one-up each other. You trade insults and sabotage each other\'s projects. But when you\'re forced to collaborate, you discover their passionate drive mirrors your own. Arguments become foreplay. Hate was just love in disguise.',
    romanticHighlights: [
      'Competitive tension that\'s actually flirting',
      'They smile secretly when you\'re not looking',
      'Saving you from danger despite "hating" you',
      'The moment they call truce and laugh together',
      'Confession: "You drive me crazy... in every way"'
    ],
    challenges: [
      'Pride getting in the way',
      'Admitting feelings first feels like losing',
      'Coworkers who know your history',
      'Breaking down defensive walls'
    ],
    happyEnding: 'Your passion for competing transforms into passion for each other. You become an unstoppable power couple, channeling your intensity into supporting each other. Your love story proves that great love often starts with great friction.'
  },

  timetravel: {
    id: 'timetravel',
    name: 'Time-Crossed Lovers',
    nameKo: '시공을 초월한 사랑',
    emoji: '⏰',
    tagline: 'Love transcends time',
    description: 'You\'re a romantic who believes love can overcome any obstacle - even time itself. Your trope features lovers separated by centuries, connecting through supernatural means.',
    storyline: 'Through time travel, reincarnation, or parallel timelines, you meet someone from a different era. The connection is immediate and profound. But your time together is limited. Can love bridge centuries? Will you find each other again? Time may be your enemy, but love is eternal.',
    iconicMoments: [
      'The magical moment you first meet across time',
      'Teaching each other about your different eras',
      'Racing against time before you\'re separated',
      'Heartbreaking temporary goodbye',
      'Finding each other again in the present'
    ],
    representativeDramas: [
      { title: 'Queen In-hyun\'s Man', year: 2012, leads: 'Ji Hyun-woo & Yoo In-na' },
      { title: 'Rooftop Prince', year: 2012, leads: 'Park Yoochun & Han Ji-min' },
      { title: 'Scarlet Heart Ryeo', year: 2016, leads: 'Lee Joon-gi & IU' }
    ],
    yourScenario: 'You discover you can time travel or meet someone from the past/future. Despite the centuries between you, your souls recognize each other. You teach them about your world; they show you theirs. Time is running out, but your love is timeless. Will you choose love over time?',
    romanticHighlights: [
      'Showing them modern technology or historical secrets',
      'Love confessions that transcend language',
      'Creating memories knowing time is limited',
      'Sacrificing everything to be together',
      'Finding evidence they existed/remembered you'
    ],
    challenges: [
      'Limited time together',
      'Cultural and temporal differences',
      'Risk of changing history',
      'Choosing between eras'
    ],
    happyEnding: 'Love finds a way across time. Whether through reincarnation, choosing to stay in their era, or them coming to yours - you prove that true love is eternal and can overcome even the impossible barrier of time itself.'
  },

  noona: {
    id: 'noona',
    name: 'Noona Romance',
    nameKo: '누나 로맨스',
    emoji: '🌸',
    tagline: 'Age is just a number',
    description: 'You appreciate maturity and aren\'t bound by social conventions. Your trope is the sweet, supportive romance with a younger man who adores you unconditionally.',
    storyline: 'A younger man pursues you persistently despite age difference. At first you resist - what will people think? But their genuine devotion, emotional maturity, and pure love wear down your defenses. They make you feel young again while treating you like a queen.',
    iconicMoments: [
      'Them calling you "Noona" adoringly',
      'Your initial resistance to their advances',
      'Them proving age doesn\'t matter',
      'Protecting you from judgment',
      'Grand romantic gesture to prove their love'
    ],
    representativeDramas: [
      { title: 'Something in the Rain', year: 2018, leads: 'Jung Hae-in & Son Ye-jin' },
      { title: 'I Need Romance 3', year: 2014, leads: 'Sung Joon & Kim So-yeon' },
      { title: 'Encounter', year: 2018, leads: 'Park Bo-gum & Song Hye-kyo' }
    ],
    yourScenario: 'A younger colleague or friend confesses their feelings. You\'re hesitant about the age gap and what others will think. But they\'re persistent, mature, and show you a pure, refreshing kind of love. Their devotion makes you realize age is truly just a number.',
    romanticHighlights: [
      'Them looking at you with pure adoration',
      'Standing up to people who judge your relationship',
      'Making you feel beautiful and cherished',
      'Sweet, old-fashioned courtship',
      'Proving their love is serious, not a phase'
    ],
    challenges: [
      'Social judgment and gossip',
      'Your own insecurities about age',
      'Disapproving family and friends',
      'Concerns about different life stages'
    ],
    happyEnding: 'You overcome societal pressure and your own doubts. Their unwavering love and maturity prove age is irrelevant when two souls are meant to be together. You find confidence and joy in a relationship built on genuine connection.'
  },

  boss: {
    id: 'boss',
    name: 'Boss & Secretary',
    nameKo: '상사와 비서',
    emoji: '💼',
    tagline: 'Professional by day, lovers by night',
    description: 'You love the forbidden thrill of workplace romance. Your trope is the slow-burn office romance between a demanding boss and their indispensable secretary.',
    storyline: 'You work for a perfectionist boss who seems impossible to please. Long hours together reveal their softer side. They depend on you more than they admit. Professional boundaries blur. Coffee runs become meaningful. Staying late becomes intimate. The office becomes your love story.',
    iconicMoments: [
      'Fixing their tie or collar',
      'Working late nights together alone',
      'They notice your new haircut immediately',
      'Jealous when others flirt with you',
      'The confession during overtime'
    ],
    representativeDramas: [
      { title: 'What\'s Wrong with Secretary Kim', year: 2018, leads: 'Park Seo-joon & Park Min-young' },
      { title: 'She Was Pretty', year: 2015, leads: 'Park Seo-joon & Hwang Jung-eum' },
      { title: 'Strong Woman Do Bong-soon', year: 2017, leads: 'Park Bo-young & Park Hyung-sik' }
    ],
    yourScenario: 'You\'re the perfect secretary to an impossible boss. They\'re demanding and cold, but you handle them expertly. Slowly they reveal vulnerabilities only you see. Business trips become romantic. Professional respect becomes personal affection. The office is where your love story unfolds.',
    romanticHighlights: [
      'Bringing them coffee exactly how they like it',
      'They can\'t function without you',
      'Shared looks across the office',
      'Business trip sharing hotel floor',
      'Resigning letter confession'
    ],
    challenges: [
      'HR policies and workplace gossip',
      'Power dynamics and ethics',
      'Separating professional and personal',
      'Risk to both your careers'
    ],
    happyEnding: 'You navigate workplace challenges and prove your relationship is genuine, not just convenient. Eventually you marry your boss, becoming equal partners in both business and life. Your professional chemistry translates perfectly to romance.'
  },

  guardian: {
    id: 'guardian',
    name: 'Supernatural Guardian',
    nameKo: '초자연적 수호자',
    emoji: '🗡️',
    tagline: 'Protected by fate',
    description: 'You believe in destiny and eternal love. Your trope features a supernatural being - a goblin, grim reaper, or immortal - who has waited centuries to find their fated person: you.',
    storyline: 'An immortal being has lived for centuries, cursed or blessed with supernatural powers. They\'ve been searching for their destined bride who can see them or end their curse. When you meet, fate clicks into place. Despite the impossibility, your souls are bound across lifetimes.',
    iconicMoments: [
      'Only you can see them or pull the sword',
      'They\'ve been waiting centuries for you',
      'Learning about their tragic past',
      'Magical moments that defy reality',
      'Choosing love despite the consequences'
    ],
    representativeDramas: [
      { title: 'Goblin', year: 2016, leads: 'Gong Yoo & Kim Go-eun' },
      { title: 'Hotel del Luna', year: 2019, leads: 'IU & Yeo Jin-goo' },
      { title: 'My Love from the Star', year: 2013, leads: 'Kim Soo-hyun & Jun Ji-hyun' }
    ],
    yourScenario: 'You encounter a supernatural being who reveals you\'re their fated person. They\'ve waited centuries; you\'re reincarnated or chosen by fate. Together you navigate magical dangers while falling deeply in love. Your connection transcends the mortal realm.',
    romanticHighlights: [
      'Discovering you\'re destined for each other',
      'Supernatural protection from danger',
      'Past life memories surfacing',
      'Magical moments only you share',
      'Love that transcends mortality'
    ],
    challenges: [
      'Different lifespans (immortal vs mortal)',
      'Supernatural dangers and enemies',
      'Curse that must be broken',
      'Choosing between love and their immortality'
    ],
    happyEnding: 'Love conquers supernatural obstacles. Either the curse breaks, you gain immortality, or you promise to find each other in every lifetime. Your love story becomes legend, proving some connections are written in the stars.'
  },

  secondchance: {
    id: 'secondchance',
    name: 'Second Chance at Love',
    nameKo: '두 번째 기회',
    emoji: '💝',
    tagline: 'Love deserves another try',
    description: 'You believe in growth and redemption. Your trope is about divorced or separated couples who rediscover each other and fall in love again - wiser, stronger, and ready this time.',
    storyline: 'You were once in love but it ended badly - divorce, breakup, or misunderstanding. Years later, you\'re both different people. A chance encounter reveals unresolved feelings. Can you overcome past mistakes? Is love sweeter the second time around?',
    iconicMoments: [
      'The awkward but electric reunion',
      'Seeing how much they\'ve changed',
      'Apologizing for past mistakes',
      'Falling in love with who they\'ve become',
      'Deciding to try again, properly this time'
    ],
    representativeDramas: [
      { title: 'On the Way to the Airport', year: 2016, leads: 'Lee Sang-yoon & Kim Ha-neul' },
      { title: 'Familiar Wife', year: 2018, leads: 'Ji Sung & Han Ji-min' },
      { title: 'Once Again', year: 2020, leads: 'Ensemble cast' }
    ],
    yourScenario: 'You divorced years ago due to immaturity or circumstances. Now you\'re forced to interact - maybe through work, kids, or mutual friends. The person who frustrated you before has grown. You see them with new eyes. Maybe you gave up too soon?',
    romanticHighlights: [
      'Remembering why you fell in love originally',
      'Appreciating their growth and maturity',
      'Having deeper, more honest conversations',
      'Building a new foundation on old love',
      'The courage to try again'
    ],
    challenges: [
      'Past hurt and resentment',
      'Fear of repeating mistakes',
      'Others questioning your decision',
      'Rebuilding trust from scratch'
    ],
    happyEnding: 'You both have grown and learned from your mistakes. This time, you communicate better, appreciate each other more, and build a stronger relationship. You prove that sometimes love is worth a second chance, and the best love stories have a second act.'
  }
};

// Quiz Questions
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What attracts you most in a romantic story?',
    options: [
      { text: 'Overcoming class differences and social barriers', scores: { chaebolgirl: 3, contractmarriage: 1 } },
      { text: 'Deep emotional connection built over years', scores: { childhoodfriends: 3, secondchance: 1 } },
      { text: 'Passionate tension and witty banter', scores: { enemiestolovers: 3, boss: 1 } },
      { text: 'Destiny and fate bringing lovers together', scores: { fatefulreunion: 3, guardian: 2, timetravel: 2 } }
    ]
  },
  {
    id: 2,
    question: 'Your ideal first meeting with your love interest:',
    options: [
      { text: 'Accidental collision that leads to argument', scores: { chaebolgirl: 2, enemiestolovers: 3 } },
      { text: 'Childhood memory or longtime friendship', scores: { childhoodfriends: 3, secondchance: 1 } },
      { text: 'Magical or supernatural encounter', scores: { guardian: 3, timetravel: 3 } },
      { text: 'Professional setting or business arrangement', scores: { boss: 3, contractmarriage: 2 } }
    ]
  },
  {
    id: 3,
    question: 'What kind of dramatic obstacle excites you most?',
    options: [
      { text: 'Disapproving parents and family opposition', scores: { chaebolgirl: 3, noona: 2 } },
      { text: 'Time limits, separation, or distance', scores: { timetravel: 3, fatefulreunion: 2 } },
      { text: 'Workplace rules and professional boundaries', scores: { boss: 3, contractmarriage: 2 } },
      { text: 'Past mistakes and second chances', scores: { secondchance: 3, fatefulreunion: 1 } }
    ]
  },
  {
    id: 4,
    question: 'Your favorite romantic moment:',
    options: [
      { text: 'Grand gesture like buying out a restaurant', scores: { chaebolgirl: 3, boss: 1 } },
      { text: 'Quiet moment of understanding without words', scores: { childhoodfriends: 3, guardian: 1 } },
      { text: 'Heated argument ending in a kiss', scores: { enemiestolovers: 3, contractmarriage: 1 } },
      { text: 'Emotional confession after long separation', scores: { fatefulreunion: 3, secondchance: 2 } }
    ]
  },
  {
    id: 5,
    question: 'How do you want your partner to show love?',
    options: [
      { text: 'Protecting you and solving your problems', scores: { chaebolgirl: 2, guardian: 3, boss: 1 } },
      { text: 'Knowing everything about you without asking', scores: { childhoodfriends: 3, boss: 1 } },
      { text: 'Passionate declarations and bold actions', scores: { enemiestolovers: 2, noona: 3 } },
      { text: 'Waiting for you no matter how long it takes', scores: { timetravel: 3, fatefulreunion: 2 } }
    ]
  },
  {
    id: 6,
    question: 'What age/power dynamic appeals to you?',
    options: [
      { text: 'Younger person pursuing older (age gap)', scores: { noona: 3, boss: 1 } },
      { text: 'Boss/employee or mentor/student dynamic', scores: { boss: 3, chaebolgirl: 1 } },
      { text: 'Equal partners who grew up together', scores: { childhoodfriends: 3, secondchance: 1 } },
      { text: 'Supernatural being and mortal human', scores: { guardian: 3, timetravel: 2 } }
    ]
  },
  {
    id: 7,
    question: 'Your ideal relationship development pace:',
    options: [
      { text: 'Fake relationship that slowly becomes real', scores: { contractmarriage: 3, boss: 1 } },
      { text: 'Hate at first sight to passionate love', scores: { enemiestolovers: 3, chaebolgirl: 1 } },
      { text: 'Instant connection from past lives/memories', scores: { timetravel: 2, guardian: 3, fatefulreunion: 2 } },
      { text: 'Slow realization over many years', scores: { childhoodfriends: 3, secondchance: 2 } }
    ]
  },
  {
    id: 8,
    question: 'Your favorite happy ending scenario:',
    options: [
      { text: 'Breaking free from family control to be together', scores: { chaebolgirl: 3, noona: 2 } },
      { text: 'Marrying your best friend/soulmate', scores: { childhoodfriends: 3, boss: 1 } },
      { text: 'Finding each other again after time apart', scores: { fatefulreunion: 3, secondchance: 3, timetravel: 1 } },
      { text: 'Choosing love over immortality/power', scores: { guardian: 3, timetravel: 2 } }
    ]
  }
];

// Calculate Result
export function calculateTrope(answers: number[][]): TropeResult {
  const scores: { [key: string]: number } = {};

  // Calculate scores from all answers
  answers.forEach((answer, questionIndex) => {
    const question = quizQuestions[questionIndex];
    answer.forEach(optionIndex => {
      const option = question.options[optionIndex];
      Object.entries(option.scores).forEach(([trope, points]) => {
        scores[trope] = (scores[trope] || 0) + points;
      });
    });
  });

  // Find the trope with highest score
  let maxScore = 0;
  let resultTrope = 'chaebolgirl';

  Object.entries(scores).forEach(([trope, score]) => {
    if (score > maxScore) {
      maxScore = score;
      resultTrope = trope;
    }
  });

  return romanceTropes[resultTrope];
}
