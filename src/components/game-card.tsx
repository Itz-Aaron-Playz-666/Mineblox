'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Game } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users } from 'lucide-react';

type GameCardProps = {
  game: Game;
};

export function GameCard({ game }: GameCardProps) {
  const coverImage = PlaceHolderImages.find(img => img.id === game.coverImageId);

  return (
    <Link href={`/play/${game.id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0">
          {coverImage && (
            <div className="aspect-[3/2] overflow-hidden">
              <Image
                src={coverImage.imageUrl}
                alt={coverImage.description}
                width={600}
                height={400}
                data-ai-hint={coverImage.imageHint}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="font-headline text-lg leading-tight mb-1 truncate group-hover:text-primary-foreground">
            {game.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">by {game.creator}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{(game.plays / 1000).toFixed(1)}k</span>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{game.rating.toFixed(1)}</span>
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
