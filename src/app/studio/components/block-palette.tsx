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
  stone: 'bg-gradient-to-br from-stone-500 to-stone-600 border-t-stone-400 border-l-stone-400 border-b-stone-700 border-r-stone-700 shadow-inner',
  dirt: 'bg-gradient-to-br from-yellow-900 to-yellow-950 border-t-yellow-800 border-l-yellow-800 border-b-black/40 border-r-black/40 shadow-inner',
  grass: "bg-gradient-to-b from-lime-500 to-lime-600 border-t-lime-400 border-l-lime-400 border-b-lime-700 border-r-lime-700 shadow-inner",
  water: 'bg-sky-500/80 border-t-sky-400/80 border-l-sky-400/80 border-b-sky-600/80 border-r-sky-600/80 shadow-inner',
  sand: 'bg-gradient-to-br from-yellow-300 to-yellow-400 border-t-yellow-200 border-l-yellow-200 border-b-yellow-500 border-r-yellow-500 shadow-inner',
  wood: 'bg-gradient-to-br from-amber-600 to-amber-800 border-t-amber-500 border-l-amber-500 border-b-amber-900 border-r-amber-900 shadow-inner',
  leaves: 'bg-gradient-to-br from-green-600 to-green-800 border-t-green-500 border-l-green-500 border-b-green-900 border-r-green-900 shadow-inner opacity-90',
  brick: 'bg-red-800 border-t-red-700 border-l-red-700 border-b-red-900 border-r-red-900 shadow-inner bg-gradient-to-br from-red-700 to-red-900',
  glass: 'bg-sky-200/30 border-t-sky-100/40 border-l-sky-100/40 border-b-sky-300/40 border-r-sky-300/40 backdrop-blur-sm',
  gold: 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-t-yellow-300 border-l-yellow-300 border-b-yellow-700 border-r-yellow-700 shadow-inner',
  bedrock: 'bg-gradient-to-br from-gray-700 to-gray-900 border-t-gray-600 border-l-gray-600 border-b-black/80 border-r-black/80 shadow-inner',
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
