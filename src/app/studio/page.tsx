import {
  Cube,
  Brush,
  PaintBucket,
  Move,
  Mountain,
  Trees,
  Cloud,
  File,
  Save,
  Play,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToolSuggester } from './components/tool-suggester';

const toolboxTools = [
  { icon: Cube, label: 'Block Tool' },
  { icon: Brush, label: 'Paint Tool' },
  { icon: PaintBucket, label: 'Fill Tool' },
  { icon: Move, label: 'Move Tool' },
];

const worldTools = [
  { icon: Mountain, label: 'Terrain' },
  { icon: Trees, label: 'Foliage' },
  { icon: Cloud, label: 'Sky & Weather' },
];

const fileTools = [
    { icon: File, label: 'New' },
    { icon: Save, label: 'Save' },
    { icon: Play, label: 'Test' },
    { icon: Share2, label: 'Publish' },
];

function ToolButton({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="w-14 h-14 flex flex-col gap-1 text-muted-foreground hover:text-primary-foreground hover:bg-primary/10">
          <Icon className="w-6 h-6" />
          <span className="text-xs">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function StudioPage() {
  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-4rem)] bg-secondary/50">
        {/* Left Toolbox */}
        <aside className="w-20 bg-background flex flex-col items-center py-4 border-r">
          <nav className="flex flex-col items-center gap-2">
            {toolboxTools.map(tool => <ToolButton key={tool.label} {...tool} />)}
          </nav>
          <Separator className="my-4" />
          <nav className="flex flex-col items-center gap-2">
            {worldTools.map(tool => <ToolButton key={tool.label} {...tool} />)}
          </nav>
          <div className="flex-grow" />
          <nav className="flex flex-col items-center gap-2">
            {fileTools.map(tool => <ToolButton key={tool.label} {...tool} />)}
          </nav>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 flex items-center justify-center bg-grid">
          <div className="text-center p-8 rounded-lg bg-background/80 backdrop-blur-sm shadow-lg">
            <h1 className="font-headline text-3xl font-bold">Your World Awaits</h1>
            <p className="text-muted-foreground">Use the tools to start building your game.</p>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-96 bg-background border-l overflow-y-auto">
          <ToolSuggester />
        </aside>
      </div>
    </TooltipProvider>
  );
}
