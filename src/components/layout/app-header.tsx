'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LogoIcon } from '../icons/logo-icon';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Discover' },
  { href: '/studio', label: 'Studio' },
  { href: '/avatar', label: 'Avatar' },
  { href: '/testing-ground', label: 'Testing Ground' },
];

export function AppHeader() {
  const pathname = usePathname();
  const avatarImage = PlaceHolderImages.find(img => img.id === 'avatar-1');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const NavLink = ({ href, label, isMobile = false }: { href: string; label: string; isMobile?: boolean }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => isMobile && setIsSheetOpen(false)}
        className={cn(
          "transition-colors hover:text-primary-foreground",
          isActive ? "text-primary-foreground font-semibold" : "text-muted-foreground",
          isMobile && "block py-2 text-lg"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LogoIcon className="h-6 w-6 text-primary-foreground" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Mineblox Studio
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                <LogoIcon className="h-6 w-6 text-primary-foreground" />
                <span className="font-bold font-headline">Mineblox Studio</span>
              </Link>
              <nav className="flex flex-col space-y-2">
                {navLinks.map(link => (
                  <NavLink key={link.href} {...link} isMobile />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {avatarImage && (
                    <AvatarImage
                      src={avatarImage.imageUrl}
                      alt="Player Avatar"
                      data-ai-hint={avatarImage.imageHint}
                    />
                  )}
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">PlayerOne</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    playerone@mineblox.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
