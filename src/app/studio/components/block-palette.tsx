'use client';

import { cn } from '@/lib/utils';
import { Gem } from 'lucide-react';

export type BlockColor = 'stone' | 'dirt' | 'grass' | 'water';

export const blockStyles: Record<BlockColor, string> = {
  stone: 'bg-slate-400 border-slate-500',
  dirt: 'bg-amber-800 border-amber-900',
  grass: 'bg-lime-500 border-lime-600',
  water: 'bg-sky-500 border-sky-600',
};

export const blockTypes: BlockColor[] = ['stone', 'dirt', 'grass', 'water'];

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
        <div className="grid grid-cols-5 gap-2">
            {blockTypes.map(b_type => (
            <button
                key={b_type}
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
            ))}
        </div>
    </div>
  );
}
