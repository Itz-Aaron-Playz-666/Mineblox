'use client';

import { games } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Play, User, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GameCard } from '@/components/game-card';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function PlayGamePage() {
  const params = useParams<{ gameId: string }>();
  const game = games.find(g => g.id === params.gameId);
  const { toast } = useToast();
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (game) {
      setFormattedDate(new Date(game.createdAt).toLocaleDateString());
    }
  }, [game]);

  if (!game) {
    notFound();
  }

  const handlePlayClick = () => {
    toast({
      title: 'Starting game...',
      description: `Now loading "${game.title}". Please wait.`,
    });
  };

  const coverImage = PlaceHolderImages.find(img => img.id === game.coverImageId);
  const otherGames = games.filter(g => g.id !== game.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary mb-4">
            {coverImage && (
              <Image
                src={coverImage.imageUrl}
                alt={coverImage.description}
                fill
                className="object-cover"
                data-ai-hint={coverImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 scale-150"
                onClick={handlePlayClick}
              >
                <Play className="mr-2 h-6 w-6" />
                Play
              </Button>
            </div>
          </div>
          <h1 className="font-headline text-4xl font-bold mb-2">{game.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-medium">{game.creator}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{game.plays.toLocaleString()} plays</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span>{game.rating}/5.0</span>
            </div>
            <Badge variant="outline">{formattedDate}</Badge>
          </div>
          <p className="text-lg">{game.description}</p>
        </div>
        <div className="lg:col-span-1">
          <h2 className="font-headline text-2xl font-bold mb-4">More Games</h2>
          <div className="space-y-4">
            {otherGames.map(g => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
