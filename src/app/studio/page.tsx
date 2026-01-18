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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToolSuggester } from './components/tool-suggester';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BlockPalette, type BlockColor, blockStyles } from './components/block-palette';
import { useToast } from '@/hooks/use-toast';

const GRID_SIZE = 40;
const TILE_SIZE = 24;

type Cell = {
  color: BlockColor | null;
};

const initialGrid = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => ({ color: null }))
);

const toolboxTools = [
  { icon: Box, label: 'Block Tool' },
  { icon: Brush, label: 'Paint Tool' },
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
    const newGrid = grid.map(r => r.slice());
    let changed = false;

    if (selectedTool === 'Block Tool' || selectedTool === 'Paint Tool') {
      if (newGrid[row][col].color !== selectedBlock) {
        newGrid[row][col].color = selectedBlock;
        changed = true;
      }
    } else if (selectedTool === 'Erase Tool') {
      if (newGrid[row][col].color !== null) {
        newGrid[row][col].color = null;
        changed = true;
      }
    }

    if (changed) {
      setGrid(newGrid);
    }
  };

  const showBlockPalette = selectedTool === 'Block Tool' || selectedTool === 'Paint Tool';
  const cursorStyle = () => {
    switch(selectedTool) {
        case 'Block Tool':
        case 'Paint Tool':
            return 'copy';
        case 'Erase Tool':
            return 'crosshair';
        case 'Move Tool':
            return 'grab';
        default:
            return 'default';
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-4rem)] bg-secondary/50">
        <aside className="w-20 bg-background flex flex-col items-center py-4 border-r z-10">
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
        </aside>

        <main className="flex-1 flex items-center justify-center bg-grid overflow-hidden p-4">
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
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'border-l border-t',
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
                />
              ))
            )}
          </div>
        </main>

        <aside className="w-96 bg-background border-l overflow-y-auto">
          {showBlockPalette && (
            <BlockPalette selectedBlock={selectedBlock} onSelectBlock={setSelectedBlock} />
          )}
          <ToolSuggester />
        </aside>
      </div>
    </TooltipProvider>
  );
}
