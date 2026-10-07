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
  {
    id: 'pack-world-categories',
    title: 'The Wider World',
    description: 'A mixed deck covering animals, music, science, culture, and more.',
    category: 'Mixed',
    isOfficial: true,
    createdBy: 'DECEIT Official',
    downloads: 0,
    likes: 0,
    words: [
      { id: 'a1', word: 'OCTOPUS', category: 'Animals', difficulty: 'easy', hint: 'Eight arms and remarkable camouflage', tags: ['ocean', 'wildlife'] },
      { id: 'a2', word: 'SNOW LEOPARD', category: 'Animals', difficulty: 'medium', hint: 'A high-altitude cat with a long tail', tags: ['mountains', 'wildlife'] },
      { id: 'a3', word: 'AXOLOTL', category: 'Animals', difficulty: 'hard', hint: 'A salamander that keeps its youthful features', tags: ['water', 'wildlife'] },
      { id: 'mu1', word: 'SAXOPHONE', category: 'Music', difficulty: 'easy', hint: 'A brass instrument with a reed', tags: ['jazz', 'instrument'] },
      { id: 'mu2', word: 'VINYL RECORD', category: 'Music', difficulty: 'medium', hint: 'An analog disc played on a turntable', tags: ['audio', 'collecting'] },
      { id: 'mu3', word: 'CONDUCTOR', category: 'Music', difficulty: 'easy', hint: 'Leads an orchestra without playing an instrument', tags: ['orchestra', 'performance'] },
      { id: 'sp1', word: 'MARATHON', category: 'Sports', difficulty: 'easy', hint: 'A long-distance race of just over 42 kilometers', tags: ['running', 'race'] },
      { id: 'sp2', word: 'CRICKET', category: 'Sports', difficulty: 'easy', hint: 'A bat-and-ball game with wickets', tags: ['team', 'field'] },
      { id: 'sp3', word: 'CURLING', category: 'Sports', difficulty: 'medium', hint: 'Players slide stones across ice toward a target', tags: ['winter', 'team'] },
      { id: 'sc1', word: 'MICROSCOPE', category: 'Science', difficulty: 'easy', hint: 'Makes tiny specimens visible', tags: ['lab', 'lens'] },
      { id: 'sc2', word: 'ECLIPSE', category: 'Science', difficulty: 'medium', hint: 'One celestial body blocks the light of another', tags: ['space', 'shadow'] },
      { id: 'sc3', word: 'PENDULUM', category: 'Science', difficulty: 'medium', hint: 'A swinging mass used to study motion and time', tags: ['physics', 'motion'] },
      { id: 'n1', word: 'CORAL REEF', category: 'Nature', difficulty: 'easy', hint: 'A colorful marine ecosystem built by tiny animals', tags: ['ocean', 'ecosystem'] },
      { id: 'n2', word: 'GLACIER', category: 'Nature', difficulty: 'easy', hint: 'A slow-moving river of ice', tags: ['ice', 'landscape'] },
      { id: 'n3', word: 'MANGROVE', category: 'Nature', difficulty: 'hard', hint: 'A coastal forest with tangled salt-tolerant roots', tags: ['coast', 'forest'] },
      { id: 'ar1', word: 'SUSPENSION BRIDGE', category: 'Architecture', difficulty: 'medium', hint: 'A roadway hangs from tall cables and towers', tags: ['engineering', 'structure'] },
      { id: 'ar2', word: 'DOME', category: 'Architecture', difficulty: 'easy', hint: 'A rounded roof over a large space', tags: ['building', 'structure'] },
      { id: 'ar3', word: 'CANTILEVER', category: 'Architecture', difficulty: 'hard', hint: 'A beam supported at only one end', tags: ['engineering', 'structure'] },
      { id: 'h1', word: 'SILK ROAD', category: 'History', difficulty: 'medium', hint: 'A network of trade routes linking Asia and Europe', tags: ['trade', 'travel'] },
      { id: 'h2', word: 'PRINTING PRESS', category: 'History', difficulty: 'easy', hint: 'A machine that transformed the spread of books', tags: ['invention', 'books'] },
      { id: 'h3', word: 'RENAISSANCE', category: 'History', difficulty: 'hard', hint: 'A European revival of art and learning', tags: ['Europe', 'culture'] },
      { id: 'l1', word: 'SHERLOCK HOLMES', category: 'Literature', difficulty: 'easy', hint: 'A detective who lives at Baker Street', tags: ['mystery', 'detective'] },
      { id: 'l2', word: 'MOBY DICK', category: 'Literature', difficulty: 'medium', hint: 'A sailor pursues a white whale', tags: ['novel', 'sea'] },
      { id: 'l3', word: 'HAMLET', category: 'Literature', difficulty: 'medium', hint: 'A Danish prince asks a famous question', tags: ['play', 'tragedy'] },
      { id: 'p1', word: 'ASTRONAUT', category: 'Professions', difficulty: 'easy', hint: 'A trained traveler beyond Earth', tags: ['space', 'career'] },
      { id: 'p2', word: 'BEEKEEPER', category: 'Professions', difficulty: 'medium', hint: 'Cares for hives and harvests honey', tags: ['craft', 'animals'] },
      { id: 'p3', word: 'CARTOGRAPHER', category: 'Professions', difficulty: 'hard', hint: 'Makes maps of places and terrain', tags: ['maps', 'craft'] },
      { id: 'fa1', word: 'TRENCH COAT', category: 'Fashion', difficulty: 'easy', hint: 'A belted outer layer with storm flaps', tags: ['clothing', 'outerwear'] },
      { id: 'fa2', word: 'KIMONO', category: 'Fashion', difficulty: 'easy', hint: 'A Japanese garment with wide sleeves', tags: ['clothing', 'tradition'] },
      { id: 'fa3', word: 'RUNWAY', category: 'Fashion', difficulty: 'medium', hint: 'Models walk this path during a show', tags: ['design', 'show'] },
      { id: 'v1', word: 'SAILBOAT', category: 'Vehicles', difficulty: 'easy', hint: 'Moves across water using wind and canvas', tags: ['water', 'travel'] },
      { id: 'v2', word: 'MOTORCYCLE', category: 'Vehicles', difficulty: 'easy', hint: 'A two-wheeled motor vehicle', tags: ['road', 'travel'] },
      { id: 'v3', word: 'CABLE CAR', category: 'Vehicles', difficulty: 'medium', hint: 'A cabin travels suspended above a city or mountain', tags: ['transport', 'travel'] },
      { id: 'my1', word: 'PEGASUS', category: 'Mythology', difficulty: 'easy', hint: 'A winged horse from Greek myth', tags: ['greek', 'creature'] },
      { id: 'my2', word: 'MINOTAUR', category: 'Mythology', difficulty: 'medium', hint: 'A half-man, half-bull said to live in a maze', tags: ['greek', 'creature'] },
      { id: 'my3', word: 'RAGNAROK', category: 'Mythology', difficulty: 'hard', hint: 'The prophesied end of the world in Norse myth', tags: ['norse', 'legend'] },
      { id: 'va1', word: 'MOSAIC', category: 'Visual Arts', difficulty: 'easy', hint: 'An image made from many small pieces', tags: ['craft', 'image'] },
      { id: 'va2', word: 'WATERCOLOR', category: 'Visual Arts', difficulty: 'easy', hint: 'Paint thinned with water on paper', tags: ['painting', 'color'] },
      { id: 'va3', word: 'SCULPTURE', category: 'Visual Arts', difficulty: 'easy', hint: 'A three-dimensional work shaped by an artist', tags: ['form', 'craft'] },
      { id: 'fe1', word: 'LANTERN FESTIVAL', category: 'Festivals', difficulty: 'medium', hint: 'A celebration where glowing lights fill the night', tags: ['light', 'celebration'] },
      { id: 'fe2', word: 'CARNIVAL', category: 'Festivals', difficulty: 'easy', hint: 'A public celebration of costumes, music, and parades', tags: ['parade', 'celebration'] },
      { id: 'fe3', word: 'HARVEST FESTIVAL', category: 'Festivals', difficulty: 'medium', hint: 'A seasonal celebration of gathered crops', tags: ['season', 'celebration'] },
      { id: 'pl1', word: 'BONSAI', category: 'Plants', difficulty: 'easy', hint: 'A miniature tree shaped in a small pot', tags: ['garden', 'tree'] },
      { id: 'pl2', word: 'SUNFLOWER', category: 'Plants', difficulty: 'easy', hint: 'A tall yellow bloom that tracks the sun', tags: ['flower', 'garden'] },
      { id: 'pl3', word: 'VENUS FLYTRAP', category: 'Plants', difficulty: 'medium', hint: 'A carnivorous plant that snaps shut on insects', tags: ['flower', 'carnivorous'] },
      { id: 'bg1', word: 'SCRABBLE', category: 'Board Games', difficulty: 'easy', hint: 'Players build words from letter tiles', tags: ['tiles', 'words'] },
      { id: 'bg2', word: 'BACKGAMMON', category: 'Board Games', difficulty: 'medium', hint: 'Players race checkers around a board using dice', tags: ['strategy', 'dice'] },
      { id: 'bg3', word: 'JENGA', category: 'Board Games', difficulty: 'easy', hint: 'Players remove wooden blocks without toppling a tower', tags: ['blocks', 'dexterity'] },
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

  public pickRandomWord(packId: string, difficulty?: 'easy' | 'medium' | 'hard', wordCategories?: string[]): WordItem {
    const pack = this.packs.get(packId) || this.packs.get('pack-movies-cinema') || BUILTIN_WORD_PACKS[0];
    let candidates = wordCategories?.length
      ? Array.from(this.packs.values()).flatMap((wordPack) => wordPack.words).filter((word) => wordCategories.includes(word.category))
      : pack.words;
    if (candidates.length === 0) candidates = pack.words;
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
