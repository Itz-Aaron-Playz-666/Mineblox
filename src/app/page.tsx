import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { GameCard } from '@/components/game-card';
import { games } from '@/lib/placeholder-data';
import { Search, Compass } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const popularGames = [...games].sort((a, b) => b.plays - a.plays);
  const newGames = [...games].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const trendingGames = [...games].sort((a, b) => b.rating - a.rating);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Build, Play, and Share Your Own Blocky Worlds
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Welcome to <span className="font-bold text-primary-foreground">Mineblox Studio</span>, the ultimate platform for creating and discovering unique block-based games.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/studio">Start Creating</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="#discover">
              <Compass className="mr-2 h-5 w-5" />
              Discover Games
            </Link>
          </Button>
        </div>
      </section>

      <section id="discover" className="space-y-12">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for games, creators, or genres..."
            className="w-full pl-10 h-12 rounded-full shadow-sm"
          />
        </div>

        <div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6">
            🔥 Trending Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingGames.slice(0, 4).map((game, index) => (
              <div
                key={game.id}
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6">
            ✨ New & Rising
          </h2>
          <Carousel
            opts={{
              align: 'start',
            }}
            className="w-full"
          >
            <CarouselContent>
              {newGames.map((game, index) => (
                <CarouselItem
                  key={game.id}
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="p-1">
                    <GameCard game={game} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6">
            🌟 Popular This Week
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularGames.map((game, index) => (
               <div
               key={game.id}
               className="animate-slide-in-up"
               style={{ animationDelay: `${(index + 4) * 100}ms` }}
             >
              <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
