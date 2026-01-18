'use client';

import { cn } from '@/lib/utils';
import { Gem } from 'lucide-react';

export type BlockColor =
  | 'stone'
  | 'dirt'
  | 'grass'
  | 'water'
  | 'sand'
  | 'wood'
  | 'leaves'
  | 'brick'
  | 'glass'
  | 'gold'
  | 'bedrock';

export const blockStyles: Record<BlockColor, string> = {
  stone: 'bg-stone-500 border-t-stone-400 border-l-stone-400 border-b-stone-600 border-r-stone-600 shadow-inner',
  dirt: 'bg-amber-800 border-t-amber-700 border-l-amber-700 border-b-amber-950 border-r-amber-950 shadow-inner',
  grass: 'bg-lime-600 border-t-lime-500 border-l-lime-500 border-b-lime-700 border-r-lime-700 shadow-inner',
  water: 'bg-sky-500/90 border-t-sky-400/90 border-l-sky-400/90 border-b-sky-600/90 border-r-sky-600/90 shadow-inner',
  sand: 'bg-yellow-400 border-t-yellow-300 border-l-yellow-300 border-b-yellow-500 border-r-yellow-500 shadow-inner',
  wood: 'bg-amber-700 border-t-amber-600 border-l-amber-600 border-b-amber-800 border-r-amber-800 shadow-inner',
  leaves: 'bg-green-700 border-t-green-600 border-l-green-600 border-b-green-800 border-r-green-800 shadow-inner',
  brick: 'bg-red-800 border-t-red-700 border-l-red-700 border-b-red-900 border-r-red-900 shadow-inner',
  glass: 'bg-sky-200/50 border-t-sky-100/50 border-l-sky-100/50 border-b-sky-300/50 border-r-sky-300/50 backdrop-blur-sm',
  gold: 'bg-yellow-500 border-t-yellow-400 border-l-yellow-400 border-b-yellow-600 border-r-yellow-600 shadow-inner',
  bedrock: 'bg-gray-800 border-t-gray-700 border-l-gray-700 border-b-gray-900 border-r-gray-900 shadow-inner',
};


export const blockTypes: BlockColor[] = [
  'stone',
  'dirt',
  'grass',
  'water',
  'sand',
  'wood',
  'leaves',
  'brick',
  'glass',
  'gold',
  'bedrock',
];

interface BlockPaletteProps {
  selectedBlock: BlockColor;
  onSelectBlock: (block: BlockColor) => void;
}

export function BlockPalette({ selectedBlock, onSelectBlock }: BlockPaletteProps) {
  return (
    <div className="p-4 border-b">
        <h3 className="font-headline text-lg font-semibold mb-4 flex items-center gap-2">
            <Gem className="w-5 h-5 text-accent" />
            Block Palette
        </h3>
        <div className="grid grid-cols-5 gap-x-2 gap-y-4">
            {blockTypes.map(b_type => (
            <div key={b_type} className="flex flex-col items-center gap-1.5">
                <button
                    onClick={() => onSelectBlock(b_type)}
                    className={cn(
                    'w-12 h-12 rounded-md border-2 border-r-[3px] border-b-[3px] transition-all',
                    blockStyles[b_type],
                    selectedBlock === b_type
                        ? 'ring-2 ring-offset-background ring-accent'
                        : 'hover:ring-1 hover:ring-accent'
                    )}
                    aria-label={`Select ${b_type} block`}
                />
                <p className="text-xs capitalize text-muted-foreground">{b_type}</p>
            </div>
            ))}
        </div>
    </div>
  );
}
