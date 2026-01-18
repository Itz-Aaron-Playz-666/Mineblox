'use client';

import {
  Box,
  Brush,
  Eraser,
  Move,
  Mountain,
  Trees,
  Cloud,
  File,
  Save,
  Play,
  Share2,
  Rabbit,
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToolSuggester } from './components/tool-suggester';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BlockPalette, type BlockColor, blockStyles } from './components/block-palette';
import { MobPalette, type MobType, mobIcons } from './components/mob-palette';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { SoundGenerator } from './components/sound-generator';

const GRID_SIZE = 40;
const TILE_SIZE = 24;

type Cell = {
  color: BlockColor | null;
  mob: MobType | null;
};

const initialGrid = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => ({ color: null, mob: null }))
);

const toolboxTools = [
  { icon: Box, label: 'Block Tool' },
  { icon: Brush, label: 'Paint Tool' },
  { icon: Rabbit, label: 'Mob Tool' },
  { icon: Eraser, label: 'Erase Tool' },
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

function ToolButton({
  icon: Icon,
  label,
  isSelected,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'w-14 h-14 flex flex-col gap-1 text-muted-foreground hover:text-primary-foreground hover:bg-primary/10',
            isSelected && 'bg-primary/20 text-primary-foreground ring-2 ring-primary'
          )}
          onClick={onClick}
          aria-pressed={isSelected}
        >
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
  const [selectedTool, setSelectedTool] = useState<string | null>('Block Tool');
  const { toast } = useToast();

  const [grid, setGrid] = useState<Cell[][]>(initialGrid);
  const [selectedBlock, setSelectedBlock] = useState<BlockColor>('grass');
  const [selectedMob, setSelectedMob] = useState<MobType>('pig');
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleToolSelect = (label: string) => {
    if (label === 'New') {
      setGrid(initialGrid);
      toast({ title: 'New world created!' });
      return;
    }
    if (label === 'Save') {
      toast({ title: 'Project Saved!', description: 'Your world has been saved.' });
      return;
    }
    if (label === 'Publish') {
      toast({ title: 'Publishing...', description: 'Your game is being prepared for the world.' });
      return;
    }
    if (label === 'Test') {
      toast({
        title: 'Entering Test Mode',
        description: 'Loading a playable version of your world.',
      });
      return;
    }

    setSelectedTool(currentTool => (currentTool === label ? null : label));
  };

  const handleCellInteraction = (row: number, col: number) => {
    setGrid(currentGrid => {
      const newGrid = currentGrid.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      let changed = false;
  
      if (selectedTool === 'Block Tool' || selectedTool === 'Paint Tool') {
        if (cell.color !== selectedBlock) {
          cell.color = selectedBlock;
          changed = true;
        }
      } else if (selectedTool === 'Mob Tool') {
        if (cell.mob !== selectedMob) {
          cell.mob = selectedMob;
          changed = true;
        }
      } else if (selectedTool === 'Erase Tool') {
        if (cell.mob !== null) {
          cell.mob = null;
          changed = true;
        }
        // Allow erasing bedrock in editor
        if (cell.color !== null) {
          cell.color = null;
          changed = true;
        }
      }
  
      if (changed) {
        return newGrid;
      }
      
      return currentGrid;
    });
  };
  

  const showBlockPalette = selectedTool === 'Block Tool' || selectedTool === 'Paint Tool';
  const showMobPalette = selectedTool === 'Mob Tool';
  
  const cursorStyle = () => {
    if (selectedTool === 'Move Tool') {
      return isMouseDown ? 'grabbing' : 'grab';
    }
    switch (selectedTool) {
      case 'Block Tool':
      case 'Paint Tool':
      case 'Mob Tool':
        return 'copy';
      case 'Erase Tool':
        return 'crosshair';
      default:
        return 'default';
    }
  };

  const leftSidebarContent = (
    <div className="flex flex-col items-center py-4 h-full">
      <nav className="flex flex-col items-center gap-2">
        {toolboxTools.map(tool => (
          <ToolButton
            key={tool.label}
            {...tool}
            isSelected={selectedTool === tool.label}
            onClick={() => handleToolSelect(tool.label)}
          />
        ))}
      </nav>
      <Separator className="my-4" />
      <nav className="flex flex-col items-center gap-2">
        {worldTools.map(tool => (
          <ToolButton
            key={tool.label}
            {...tool}
            isSelected={selectedTool === tool.label}
            onClick={() => handleToolSelect(tool.label)}
          />
        ))}
      </nav>
      <div className="flex-grow" />
      <nav className="flex flex-col items-center gap-2">
        {fileTools.map(tool => (
          <ToolButton key={tool.label} {...tool} onClick={() => handleToolSelect(tool.label)} />
        ))}
      </nav>
    </div>
  );

  const rightSidebarContent = (
    <>
      {showBlockPalette && (
        <BlockPalette selectedBlock={selectedBlock} onSelectBlock={setSelectedBlock} />
      )}
      {showMobPalette && (
        <MobPalette selectedMob={selectedMob} onSelectMob={setSelectedMob} />
      )}
      <ToolSuggester />
      <div className="p-4 border-t">
        <SoundGenerator />
      </div>
    </>
  );

  return (
    <TooltipProvider>
      <div className="relative flex h-[calc(100vh-4rem)] bg-secondary/50">
        
        {/* Mobile Sidebar Triggers */}
        <div className="absolute top-4 left-4 z-20 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="shadow-lg">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Left Panel</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80px] p-0">
              <SheetHeader>
                <SheetTitle className="sr-only">Tools Panel</SheetTitle>
                <SheetDescription className="sr-only">
                  A panel with building, world, and file management tools.
                </SheetDescription>
              </SheetHeader>
              {leftSidebarContent}
            </SheetContent>
          </Sheet>
        </div>

        <div className="absolute top-4 right-4 z-20 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="shadow-lg">
                <PanelRight className="h-5 w-5" />
                <span className="sr-only">Toggle Right Panel</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="sr-only">Creative Tools Panel</SheetTitle>
                <SheetDescription className="sr-only">
                  A panel with palettes for blocks and mobs, and AI-powered tools for suggestions and audio generation.
                </SheetDescription>
              </SheetHeader>
              {rightSidebarContent}
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Sidebars */}
        <aside className="w-20 bg-background hidden md:flex flex-col border-r z-10">
          {leftSidebarContent}
        </aside>

        <main className="flex-1 flex items-center justify-center bg-grid overflow-auto p-4">
          <div
            className="grid border-r border-b border-muted/50 shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
              cursor: cursorStyle()
            }}
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const MobIcon = cell.mob ? mobIcons[cell.mob] : null;
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      'border-l border-t relative',
                      cell.color
                        ? `${blockStyles[cell.color]} border-r-[3px] border-b-[3px]`
                        : 'border-muted/50 bg-background/50 hover:bg-secondary/80'
                    )}
                    style={{ width: `${TILE_SIZE}px`, height: `${TILE_SIZE}px` }}
                    onMouseDown={() => {
                      handleCellInteraction(rowIndex, colIndex);
                    }}
                    onMouseEnter={() => {
                      if (isMouseDown) {
                        handleCellInteraction(rowIndex, colIndex);
                      }
                    }}
                  >
                    {MobIcon && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <MobIcon className="w-[80%] h-[80%] text-foreground/80" />
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </main>

        <aside className="w-96 bg-background border-l overflow-y-auto hidden lg:block">
          {rightSidebarContent}
        </aside>
      </div>
    </TooltipProvider>
  );
}
