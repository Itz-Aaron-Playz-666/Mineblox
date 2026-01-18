'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { suggestBuildingToolsAction, explainToolUsageAction, SuggestionState } from '@/app/studio/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WandSparkles, Loader2, Info, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const initialState: SuggestionState = {
  suggestedTools: [],
  reasoning: '',
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <WandSparkles className="mr-2 h-4 w-4" />
      )}
      Get Suggestions
    </Button>
  );
}

export function ToolSuggester() {
  const [state, formAction] = useActionState(suggestBuildingToolsAction, initialState);
  const [showResults, setShowResults] = useState(false);
  
  const [explainingTool, setExplainingTool] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [explanationError, setExplanationError] = useState<string | null>(null);
  const [isExplanationLoading, startExplanationTransition] = useTransition();

  useEffect(() => {
    if (state.timestamp) {
      setShowResults(true);
      setExplainingTool(null);
      setExplanation('');
      setExplanationError(null);
    }
  }, [state.timestamp]);

  const handleExplainTool = (toolName: string) => {
    if (explainingTool === toolName) {
      setExplainingTool(null);
      return;
    }

    const form = document.querySelector('form');
    const designGoals = (form?.elements.namedItem('designGoals') as HTMLTextAreaElement)?.value || '';

    setExplainingTool(toolName);
    setExplanation('');
    setExplanationError(null);
    
    if (!designGoals) {
      setExplanationError("Please enter your design goals before asking for an explanation.");
      return;
    }

    startExplanationTransition(async () => {
      const result = await explainToolUsageAction(toolName, designGoals);
      if (result.error) {
        setExplanationError(result.error);
      } else {
        setExplanation(result.explanation || '');
      }
    });
  };

  return (
    <>
      <form action={formAction} className="p-4 space-y-4">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <WandSparkles className="w-6 h-6 text-accent" />
              AI Tool Suggester
            </CardTitle>
            <CardDescription>
              Describe your game idea, and our AI will suggest the best tools for the job.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="design-goals">Design Goals</Label>
              <Textarea
                id="design-goals"
                name="designGoals"
                placeholder="e.g., 'I want to build a large, natural-looking mountain with forests and rivers for an open-world exploration game.'"
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creation-history">Creation History (Optional)</Label>
              <Textarea
                id="creation-history"
                name="creationHistory"
                placeholder="e.g., 'I usually build small houses and simple platformers.'"
                rows={3}
              />
            </div>
            {state.error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      {showResults && (
        <div className="p-4 border-t">
          <h3 className="font-headline text-lg font-semibold mb-4">AI Suggestions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Suggested Tools:</h4>
              <div className="flex flex-wrap gap-2">
                {state.suggestedTools?.map((tool) => (
                  <Button 
                    key={tool} 
                    variant={explainingTool === tool ? 'default' : 'secondary'} 
                    onClick={() => handleExplainTool(tool)}
                  >
                    {tool}
                    {explainingTool === tool ? <X className="ml-2 h-4 w-4"/> : <Info className="ml-2 h-4 w-4"/>}
                  </Button>
                )) || <p className="text-sm text-muted-foreground">No tools suggested.</p>}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Reasoning:</h4>
              <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                {state.reasoning || "No reasoning provided."}
              </p>
            </div>
            
            {explainingTool && (
                <div className="space-y-2 pt-2">
                    <h4 className="font-semibold">
                        {`About "${explainingTool}"`}
                    </h4>
                    <div className="text-sm bg-secondary/50 p-3 rounded-md min-h-[6rem]">
                        {isExplanationLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : explanationError ? (
                            <Alert variant="destructive" className="bg-transparent border-0">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{explanationError}</AlertDescription>
                            </Alert>
                        ) : (
                            <p className="text-foreground">{explanation}</p>
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
