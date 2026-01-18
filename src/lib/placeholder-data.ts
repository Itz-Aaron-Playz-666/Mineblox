export type Game = {
  id: string;
  title: string;
  creator: string;
  description: string;
  coverImageId: string;
  plays: number;
  rating: number;
  createdAt: string;
};

export type CustomizationItem = {
  id: string;
  name: string;
  type: 'skin' | 'accessory';
  imageId: string;
};

export const games: Game[] = [
  {
    id: '1',
    title: 'Castle Crafters',
    creator: 'BlockBuilder101',
    description: 'Build and defend your own castle in this epic medieval strategy game.',
    coverImageId: 'game-cover-1',
    plays: 12500,
    rating: 4.8,
    createdAt: '2024-05-10T14:48:00.000Z',
  },
  {
    id: '2',
    title: 'CyberCity Run',
    creator: 'FutureGames',
    description: 'Race through a futuristic metropolis in this high-speed parkour adventure.',
    coverImageId: 'game-cover-2',
    plays: 23000,
    rating: 4.9,
    createdAt: '2024-05-20T18:00:00.000Z',
  },
  {
    id: '3',
    title: 'Forest Village Sim',
    creator: 'CozyCreations',
    description: 'Create and manage a peaceful village in a charming, blocky forest.',
    coverImageId: 'game-cover-3',
    plays: 8500,
    rating: 4.7,
    createdAt: '2024-04-28T10:20:00.000Z',
  },
  {
    id: '4',
    title: 'Volcano Escape',
    creator: 'AdrenalineJunkie',
    description: 'An intense parkour challenge where you must escape a rising lava flow.',
    coverImageId: 'game-cover-4',
    plays: 18000,
    rating: 4.6,
    createdAt: '2024-05-15T12:00:00.000Z',
  },
  {
    id: '5',
    title: 'Stellar Station',
    creator: 'CosmoCraft',
    description: 'Build and expand your own space station among the stars.',
    coverImageId: 'game-cover-5',
    plays: 9200,
    rating: 4.5,
    createdAt: '2024-05-01T09:00:00.000Z',
  },
  {
    id: '6',
    title: 'AquaBlock Adventure',
    creator: 'DeepDiveDev',
    description: 'Explore a mysterious underwater city and uncover its secrets.',
    coverImageId: 'game-cover-6',
    plays: 11500,
    rating: 4.7,
    createdAt: '2024-05-18T20:30:00.000Z',
  },
  {
    id: '7',
    title: 'Pyramid Puzzler',
    creator: 'LogicLord',
    description: 'Solve intricate puzzles inside a massive desert temple.',
    coverImageId: 'game-cover-7',
    plays: 7800,
    rating: 4.8,
    createdAt: '2024-05-21T11:00:00.000Z',
  },
  {
    id: '8',
    title: 'Blocky Racers',
    creator: 'SpeedyBricks',
    description: 'Compete in high-octane races with fully customizable blocky cars.',
    coverImageId: 'game-cover-8',
    plays: 15400,
    rating: 4.4,
    createdAt: '2024-05-12T16:00:00.000Z',
  },
];

export const customizationItems: CustomizationItem[] = [
    { id: 'c1', name: 'Classic Steve', type: 'skin', imageId: 'skin-1'},
    { id: 'c2', name: 'Robotron', type: 'skin', imageId: 'skin-2'},
    { id: 'c3', name: 'Stargazer', type: 'skin', imageId: 'skin-3'},
    { id: 'c4', name: 'Shadow Shinobi', type: 'skin', imageId: 'skin-4'},
    { id: 'c5', name: 'Blocky Top Hat', type: 'accessory', imageId: 'accessory-1'},
    { id: 'c6', name: 'Pixel Shades', type: 'accessory', imageId: 'accessory-2'},
    { id: 'c7', name: 'Guardian Sword', type: 'accessory', imageId: 'accessory-3'},
    { id: 'c8', name: 'Cubist Wings', type: 'accessory', imageId: 'accessory-4'},
]
