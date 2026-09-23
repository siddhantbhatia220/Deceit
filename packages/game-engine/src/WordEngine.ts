import { WordPack, WordItem } from '@deceit/game-types';

export const BUILTIN_WORD_PACKS: WordPack[] = [
  {
    id: 'pack-movies-cinema',
    title: 'Movies & Cinema',
    description: 'Iconic blockbusters, classic cinema, franchises, and characters.',
    category: 'Movies',
    isOfficial: true,
    createdBy: 'DECEIT Official',
    downloads: 24500,
    likes: 6200,
    words: [
      { id: 'm1', word: 'INTERSTELLAR', category: 'Movies', difficulty: 'medium', hint: 'Space, black holes, and time dilation', tags: ['sci-fi', 'space', 'nolan'] },
      { id: 'm2', word: 'INCEPTION', category: 'Movies', difficulty: 'medium', hint: 'Entering dreams within dreams', tags: ['sci-fi', 'dreams', 'heist'] },
      { id: 'm3', word: 'TITANIC', category: 'Movies', difficulty: 'easy', hint: 'Luxury ship and iceberg disaster', tags: ['romance', 'ocean', 'ship'] },
      { id: 'm4', word: 'THE MATRIX', category: 'Movies', difficulty: 'easy', hint: 'Red pill, blue pill, virtual reality simulation', tags: ['sci-fi', 'cyberpunk', 'simulation'] },
      { id: 'm5', word: 'AVATAR', category: 'Movies', difficulty: 'easy', hint: 'Blue aliens on planet Pandora', tags: ['sci-fi', 'alien', '3d'] },
      { id: 'm6', word: 'JURASSIC PARK', category: 'Movies', difficulty: 'easy', hint: 'Genetically cloned dinosaurs in a theme park', tags: ['dinosaurs', 'adventure', 'park'] },
      { id: 'm7', word: 'HARRY POTTER', category: 'Movies', difficulty: 'easy', hint: 'Wizards, wands, and Hogwarts school', tags: ['magic', 'fantasy', 'wizards'] },
      { id: 'm8', word: 'THE GODFATHER', category: 'Movies', difficulty: 'medium', hint: 'Mafia family syndicate and offers you cannot refuse', tags: ['crime', 'mafia', 'classic'] },
      { id: 'm9', word: 'PULP FICTION', category: 'Movies', difficulty: 'hard', hint: 'Nonlinear crime anthology and mysterious glowing briefcase', tags: ['crime', 'tarantino', 'cult'] },
      { id: 'm10', word: 'STAR WARS', category: 'Movies', difficulty: 'easy', hint: 'Lightsabers, Jedi, and the Force', tags: ['sci-fi', 'space', 'jedi'] },
    ],
  },
  {
    id: 'pack-tech-gaming',
    title: 'Tech, AI & Video Games',
    description: 'Popular games, software, cyberspace, and technology hardware.',
    category: 'Gaming & Tech',
    isOfficial: true,
    createdBy: 'DECEIT Official',
    downloads: 31000,
    likes: 8900,
    words: [
      { id: 't1', word: 'MINECRAFT', category: 'Gaming & Tech', difficulty: 'easy', hint: 'Pixelated blocks, crafting, and mining', tags: ['game', 'sandbox', 'blocks'] },
      { id: 't2', word: 'PLAYSTATION', category: 'Gaming & Tech', difficulty: 'easy', hint: 'Sony video game console family', tags: ['hardware', 'console', 'sony'] },
      { id: 't3', word: 'SMARTPHONE', category: 'Gaming & Tech', difficulty: 'easy', hint: 'Pocket touchscreen mobile computing device', tags: ['gadget', 'mobile', 'phone'] },
      { id: 't4', word: 'ARTIFICIAL INTELLIGENCE', category: 'Gaming & Tech', difficulty: 'medium', hint: 'Neural networks and machine cognition', tags: ['ai', 'future', 'software'] },
      { id: 't5', word: 'SUPER MARIO', category: 'Gaming & Tech', difficulty: 'easy', hint: 'Nintendo plumber hopping on turtles to save Peach', tags: ['nintendo', 'platformer', 'retro'] },
      { id: 't6', word: 'CYBERPUNK', category: 'Gaming & Tech', difficulty: 'medium', hint: 'High-tech low-life neon futuristic dystopian world', tags: ['genre', 'neon', 'future'] },
      { id: 't7', word: 'VIRTUAL REALITY', category: 'Gaming & Tech', difficulty: 'easy', hint: 'Headset immersion in 3D digital environments', tags: ['vr', 'hardware', 'gaming'] },
      { id: 't8', word: 'FORTNITE', category: 'Gaming & Tech', difficulty: 'easy', hint: 'Battle Royale, building ramps, and dancing emotes', tags: ['battle-royale', 'gaming', 'pvp'] },
    ],
  },
  {
    id: 'pack-food-cuisines',
    title: 'World Cuisines & Treats',
    description: 'Delicious global street foods, famous delicacies, and sweet treats.',
    category: 'Food',
    isOfficial: true,
    createdBy: 'DECEIT Official',
    downloads: 19400,
    likes: 4700,
    words: [
      { id: 'f1', word: 'PIZZA', category: 'Food', difficulty: 'easy', hint: 'Baked flat dough with tomato sauce and melted cheese', tags: ['italian', 'fast-food', 'cheese'] },
      { id: 'f2', word: 'SUSHI', category: 'Food', difficulty: 'easy', hint: 'Vinegared rice rolls with fresh raw fish and nori seaweed', tags: ['japanese', 'seafood', 'rice'] },
      { id: 'f3', word: 'BURGER', category: 'Food', difficulty: 'easy', hint: 'Grilled patty inside a sliced bun with toppings', tags: ['american', 'fast-food', 'patty'] },
      { id: 'f4', word: 'TACOS', category: 'Food', difficulty: 'easy', hint: 'Folded corn tortilla stuffed with spiced meats and salsa', tags: ['mexican', 'tortilla', 'spicy'] },
      { id: 'f5', word: 'CROISSANT', category: 'Food', difficulty: 'medium', hint: 'Buttery flaky crescent pastry from Paris', tags: ['french', 'bakery', 'pastry'] },
      { id: 'f6', word: 'BIRYANl', category: 'Food', difficulty: 'medium', hint: 'Aromatic layered spiced rice dish with meat or veggies', tags: ['indian', 'rice', 'spiced'] },
      { id: 'f7', word: 'CHOCOLATE', category: 'Food', difficulty: 'easy', hint: 'Sweet confectionery made from roasted cacao beans', tags: ['sweet', 'candy', 'cacao'] },
    ],
  },
  {
    id: 'pack-travel-wonders',
    title: 'World Marvels & Travel',
    description: 'Famous monuments, historic landmarks, and world destinations.',
    category: 'Travel',
    isOfficial: true,
    createdBy: 'DECEIT Official',
    downloads: 16200,
    likes: 3900,
    words: [
      { id: 'w1', word: 'EIFFEL TOWER', category: 'Travel', difficulty: 'easy', hint: 'Iron lattice tower in Paris overlooking the Seine', tags: ['paris', 'monument', 'france'] },
      { id: 'w2', word: 'TAJ MAHAL', category: 'Travel', difficulty: 'easy', hint: 'White marble monument of love located in Agra', tags: ['india', 'marble', 'monument'] },
      { id: 'w3', word: 'PYRAMIDS OF GIZA', category: 'Travel', difficulty: 'easy', hint: 'Ancient pharaoh tombs in the Egyptian desert', tags: ['egypt', 'ancient', 'desert'] },
      { id: 'w4', word: 'GREAT WALL OF CHINA', category: 'Travel', difficulty: 'easy', hint: 'Thousands of miles of ancient defensive stone walls', tags: ['china', 'ancient', 'wall'] },
      { id: 'w5', word: 'MOUNT EVEREST', category: 'Travel', difficulty: 'easy', hint: 'The highest elevation mountain peak in the world', tags: ['mountain', 'himalayas', 'peak'] },
      { id: 'w6', word: 'COLOSSEUM', category: 'Travel', difficulty: 'medium', hint: 'Ancient amphitheater in Rome where gladiators fought', tags: ['rome', 'gladiator', 'italy'] },
    ],
  },
  {
    id: 'pack-college-friends',
    title: 'College & Hostel Life',
    description: 'Campus memories, exams, professors, and canteen moments.',
    category: 'College',
    isOfficial: true,
    createdBy: 'DECEIT Official',
    downloads: 12100,
    likes: 3100,
    words: [
      { id: 'c1', word: 'HOSTEL', category: 'College', difficulty: 'easy', hint: 'Student dorm accommodation and late night hangouts', tags: ['campus', 'dorm', 'friends'] },
      { id: 'c2', word: 'PROFESSOR', category: 'College', difficulty: 'easy', hint: 'Lecturer in the classroom delivering syllabus slides', tags: ['teacher', 'lecture', 'academics'] },
      { id: 'c3', word: 'CANTEEN', category: 'College', difficulty: 'easy', hint: 'The campus cafeteria where students gather to eat and chat', tags: ['food', 'hangout', 'campus'] },
      { id: 'c4', word: 'ASSIGNMENT', category: 'College', difficulty: 'easy', hint: 'Homework project submitted right before midnight deadline', tags: ['homework', 'deadline', 'study'] },
      { id: 'c5', word: 'EXAM', category: 'College', difficulty: 'easy', hint: 'Question paper, hall ticket, and study stress', tags: ['test', 'grades', 'stress'] },
      { id: 'c6', word: 'ATTENDANCE', category: 'College', difficulty: 'medium', hint: '75% mandatory requirement to sit for final semester', tags: ['proxy', 'rollcall', 'campus'] },
    ],
  },
];

export class WordEngine {
  private packs: Map<string, WordPack> = new Map();

  constructor(initialPacks: WordPack[] = BUILTIN_WORD_PACKS) {
    initialPacks.forEach((p) => this.packs.set(p.id, p));
  }

  public registerPack(pack: WordPack): void {
    this.packs.set(pack.id, pack);
  }

  public getPack(packId: string): WordPack | undefined {
    return this.packs.get(packId);
  }

  public getAllPacks(): WordPack[] {
    return Array.from(this.packs.values());
  }

  public pickRandomWord(packId: string, difficulty?: 'easy' | 'medium' | 'hard'): WordItem {
    const pack = this.packs.get(packId) || this.packs.get('pack-movies-cinema') || BUILTIN_WORD_PACKS[0];
    let candidates = pack.words;
    if (difficulty) {
      const filtered = candidates.filter((w) => w.difficulty === difficulty);
      if (filtered.length > 0) candidates = filtered;
    }
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  public importWordsFromCSV(csvContent: string, packTitle: string, category: string): WordPack {
    const lines = csvContent.split('\n').map((l) => l.trim()).filter(Boolean);
    const words: WordItem[] = [];
    
    // Check if first line is header
    const startIndex = lines[0].toLowerCase().includes('word') ? 1 : 0;
    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts[0]) {
        words.push({
          id: `w-custom-${Date.now()}-${i}`,
          word: parts[0].toUpperCase(),
          category: parts[1] || category,
          difficulty: (parts[2] as 'easy' | 'medium' | 'hard') || 'medium',
          hint: parts[3] || undefined,
          tags: [category.toLowerCase(), 'custom'],
        });
      }
    }

    const newPack: WordPack = {
      id: `custom-pack-${Date.now()}`,
      title: packTitle,
      description: `Custom pack created with ${words.length} words.`,
      category,
      isOfficial: false,
      createdBy: 'User',
      downloads: 0,
      likes: 0,
      words,
    };

    this.registerPack(newPack);
    return newPack;
  }
}
