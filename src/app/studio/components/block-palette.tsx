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
  stone: 'bg-slate-400 border-slate-500',
  dirt: 'bg-amber-800 border-amber-900',
  grass: 'bg-lime-500 border-lime-600',
  water: 'bg-sky-500 border-sky-600',
  sand: 'bg-yellow-300 border-yellow-400',
  wood: 'bg-amber-600 border-amber-700',
  leaves: 'bg-green-600 border-green-700',
  brick: 'bg-red-700 border-red-800',
  glass: 'bg-sky-200/50 border-sky-300/50',
  gold: 'bg-yellow-500 border-yellow-600',
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
                        ? 'border-accent ring-2 ring-accent'
                        : 'border-input hover:border-accent'
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
