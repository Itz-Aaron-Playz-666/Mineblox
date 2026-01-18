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
  | 'gold';

export const blockStyles: Record<BlockColor, string> = {
  stone: 'bg-slate-400 border-t-slate-300 border-l-slate-300 border-b-slate-500 border-r-slate-500',
  dirt: 'bg-amber-800 border-t-amber-700 border-l-amber-700 border-b-amber-900 border-r-amber-900',
  grass: 'bg-lime-500 border-t-lime-400 border-l-lime-400 border-b-lime-600 border-r-lime-600',
  water: 'bg-sky-500 border-t-sky-400 border-l-sky-400 border-b-sky-600 border-r-sky-600',
  sand: 'bg-yellow-300 border-t-yellow-200 border-l-yellow-200 border-b-yellow-400 border-r-yellow-400',
  wood: 'bg-amber-600 border-t-amber-500 border-l-amber-500 border-b-amber-700 border-r-amber-700',
  leaves: 'bg-green-600 border-t-green-500 border-l-green-500 border-b-green-700 border-r-green-700',
  brick: 'bg-red-700 border-t-red-600 border-l-red-600 border-b-red-800 border-r-red-800',
  glass: 'bg-sky-200/50 border-t-sky-100/50 border-l-sky-100/50 border-b-sky-300/50 border-r-sky-300/50',
  gold: 'bg-yellow-500 border-t-yellow-400 border-l-yellow-400 border-b-yellow-600 border-r-yellow-600',
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
                    'w-12 h-12 rounded-md border-2 border-r-4 border-b-4 transition-all',
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
