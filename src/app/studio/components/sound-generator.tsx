'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Music, Loader2 } from 'lucide-react';
import { generateAudioAction } from '@/app/studio/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SoundGenerator() {
    const [text, setText] = useState('8-bit power-up sound');
    const [audioData, setAudioData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleGenerateSound = () => {
        setError(null);
        setAudioData(null);
        startTransition(async () => {
            const result = await generateAudioAction(text);
            if (result.error) {
                setError(result.error);
            } else if (result.audioDataUri) {
                setAudioData(result.audioDataUri);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Music className="w-6 h-6 text-accent" />
                    AI Audio Generator
                </CardTitle>
                <CardDescription>
                    Describe a sound or a short musical phrase and the AI will create it.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="sound-description">Description</Label>
                    <Textarea
                        id="sound-description"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g., 'footstep on grass' or 'chiptune background music'"
                        rows={3}
                    />
                </div>
                <Button onClick={handleGenerateSound} disabled={isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Music className="mr-2 h-4 w-4" />
                    )}
                    Generate Audio
                </Button>
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {audioData && (
                    <div className="space-y-2 pt-4">
                        <Label>Preview</Label>
                        <audio controls src={audioData} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
