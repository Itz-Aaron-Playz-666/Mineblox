'use client';

import { cn } from '@/lib/utils';
import { Ghost, PiggyBank, Rabbit, User, type LucideIcon } from 'lucide-react';

export type MobType = 'pig' | 'zombie' | 'creeper';

export const mobIcons: Record<MobType, LucideIcon> = {
  pig: PiggyBank,
  zombie: User,
  creeper: Ghost,
};

export const mobNames: Record<MobType, string> = {
    pig: "Pig",
    zombie: "Zombie",
    creeper: "Creeper"
}

export const mobTypes: MobType[] = [
  'pig',
  'zombie',
  'creeper',
];

interface MobPaletteProps {
  selectedMob: MobType;
  onSelectMob: (mob: MobType) => void;
}

export function MobPalette({ selectedMob, onSelectMob }: MobPaletteProps) {
  return (
    <div className="p-4 border-b">
        <h3 className="font-headline text-lg font-semibold mb-4 flex items-center gap-2">
            <Rabbit className="w-5 h-5 text-accent" />
            Mob Palette
        </h3>
        <div className="grid grid-cols-3 gap-x-2 gap-y-4">
            {mobTypes.map(mobType => {
                const Icon = mobIcons[mobType];
                return (
                    <div key={mobType} className="flex flex-col items-center gap-1.5">
                        <button
                            onClick={() => onSelectMob(mobType)}
                            className={cn(
                            'w-12 h-12 rounded-md border-2 flex items-center justify-center bg-secondary transition-all',
                            selectedMob === mobType
                                ? 'ring-2 ring-offset-background ring-accent border-accent'
                                : 'hover:ring-1 hover:ring-accent border-input'
                            )}
                            aria-label={`Select ${mobType}`}
                        >
                            <Icon className="w-8 h-8 text-secondary-foreground" />
                        </button>
                        <p className="text-xs capitalize text-muted-foreground">{mobNames[mobType]}</p>
                    </div>
                )
            })}
        </div>
    </div>
  );
}
