'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { customizationItems } from '@/lib/placeholder-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Rotate3d, Dices, Save } from 'lucide-react';

export default function AvatarPage() {
  const [selectedSkin, setSelectedSkin] = useState(customizationItems.find(item => item.type === 'skin'));
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  const skins = customizationItems.filter(item => item.type === 'skin');
  const accessories = customizationItems.filter(item => item.type === 'accessory');

  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev =>
      prev.includes(id) ? prev.filter(accId => accId !== id) : [...prev, id]
    );
  };

  const skinImage = PlaceHolderImages.find(img => img.id === selectedSkin?.imageId);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Avatar Customization</h1>
        <p className="text-muted-foreground">Personalize your look for your next adventure.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="aspect-square rounded-lg bg-grid relative overflow-hidden">
                {skinImage && (
                  <Image
                    src={skinImage.imageUrl}
                    alt={skinImage.description}
                    fill
                    className="object-contain"
                    data-ai-hint={skinImage.imageHint}
                  />
                )}
                {selectedAccessories.map(accId => {
                  const accessory = customizationItems.find(item => item.id === accId);
                  const accImage = PlaceHolderImages.find(img => img.id === accessory?.imageId);
                  if (!accImage) return null;
                  return (
                    <Image
                      key={accId}
                      src={accImage.imageUrl}
                      alt={accImage.description}
                      fill
                      className="object-contain"
                      data-ai-hint={accImage.imageHint}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="secondary" className="w-full">
                <Rotate3d className="mr-2 h-4 w-4" />
                Rotate
            </Button>
            <Button variant="outline" size="icon">
                <Dices className="h-4 w-4" />
                <span className="sr-only">Randomize</span>
            </Button>
          </div>
          <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="skins" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="skins">Skins</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
            </TabsList>
            <TabsContent value="skins">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {skins.map(skin => {
                      const image = PlaceHolderImages.find(img => img.id === skin.imageId);
                      if (!image) return null;
                      return (
                        <button
                          key={skin.id}
                          onClick={() => setSelectedSkin(skin)}
                          className={cn(
                            'relative aspect-square rounded-md overflow-hidden border-2 transition-all',
                            selectedSkin?.id === skin.id
                              ? 'border-accent ring-2 ring-accent'
                              : 'border-transparent hover:border-accent'
                          )}
                        >
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                          />
                          <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs text-center p-1 truncate">{skin.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="accessories">
            <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {accessories.map(accessory => {
                      const image = PlaceHolderImages.find(img => img.id === accessory.imageId);
                      if (!image) return null;
                      return (
                        <button
                          key={accessory.id}
                          onClick={() => toggleAccessory(accessory.id)}
                          className={cn(
                            'relative aspect-square rounded-md overflow-hidden border-2 transition-all',
                            selectedAccessories.includes(accessory.id)
                              ? 'border-accent ring-2 ring-accent'
                              : 'border-transparent hover:border-accent'
                          )}
                        >
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                          />
                           <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs text-center p-1 truncate">{accessory.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
