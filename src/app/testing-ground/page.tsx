'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eraser, Square } from 'lucide-react';

const GRID_SIZE = 20;
const TILE_SIZE = 30; // in pixels

type Tool = 'draw' | 'erase';
type BlockColor =
  | 'stone'
  | 'dirt'
  | 'grass'
  | 'water'
  | 'sand'
  | 'wood'
  | 'leaves'
  | 'brick'
  | 'glass'
  | 'gold';

const blockStyles: Record<BlockColor, string> = {
  stone: 'bg-slate-400 border-slate-500',
  dirt: 'bg-amber-800 border-amber-900',
  grass: 'bg-lime-500 border-lime-600',
  water: 'bg-sky-500 border-sky-600',
  sand: 'bg-yellow-300 border-yellow-400',
  wood: 'bg-amber-600 border-amber-700',
  leaves: 'bg-green-600 border-green-700',
  brick: 'bg-red-700 border-red-800',
  glass: 'bg-sky-200/50 border-sky-300/50',
  gold: 'bg-yellow-500 border-yellow-600',
};

const blockTypes: BlockColor[] = [
  'stone',
  'dirt',
  'grass',
  'water',
  'sand',
  'wood',
  'leaves',
  'brick',
  'glass',
  'gold',
];

type Cell = {
  color: BlockColor | null;
};

const initialGrid = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => ({ color: null }))
);

export default function TestingGroundPage() {
  const [grid, setGrid] = useState<Cell[][]>(initialGrid);
  const [selectedBlock, setSelectedBlock] = useState<BlockColor>('stone');
  const [tool, setTool] = useState<Tool>('draw');
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleCellInteraction = (row: number, col: number) => {
    const newGrid = grid.map(r => r.slice());
    if (tool === 'draw') {
      newGrid[row][col].color = selectedBlock;
    } else {
      newGrid[row][col].color = null;
    }
    setGrid(newGrid);
  };
  
  const resetGrid = () => {
    setGrid(Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({ color: null }))
    ));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Testing Ground</h1>
        <p className="text-muted-foreground">
          A simple 2D block-based world. Select a block, then click and drag to build!
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Toolbar */}
        <aside className="lg:w-64">
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Mode</h3>
                 <div className="flex gap-2">
                    <Button 
                        variant={tool === 'draw' ? 'secondary' : 'outline'} 
                        size="icon" 
                        onClick={() => setTool('draw')}
                        aria-label="Draw tool"
                    >
                        <Square />
                    </Button>
                    <Button 
                        variant={tool === 'erase' ? 'secondary' : 'outline'} 
                        size="icon" 
                        onClick={() => setTool('erase')}
                        aria-label="Erase tool"
                    >
                        <Eraser />
                    </Button>
                 </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Blocks</h3>
                <div className="grid grid-cols-5 gap-2">
                  {blockTypes.map(b_type => (
                    <button
                      key={b_type}
                      onClick={() => setSelectedBlock(b_type)}
                      className={cn(
                        'w-10 h-10 rounded-md border-2 border-r-4 border-b-4',
                        blockStyles[b_type],
                        selectedBlock === b_type && tool === 'draw'
                          ? 'border-accent ring-2 ring-accent'
                          : 'border-transparent'
                      )}
                      aria-label={`Select ${b_type} block`}
                    />
                  ))}
                </div>
              </div>
               <Button onClick={resetGrid} variant="destructive" className="w-full">
                Reset World
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Grid */}
        <main className="flex-1 flex justify-center items-start">
          <div
            className="grid border-r border-b border-muted"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
              width: `${GRID_SIZE * TILE_SIZE}px`,
              cursor: tool === 'draw' ? 'copy' : 'crosshair'
            }}
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
                      ? `${blockStyles[cell.color]} border-r-4 border-b-4`
                      : 'border-muted bg-background hover:bg-secondary'
                  )}
                  style={{ width: `${TILE_SIZE}px`, height: `${TILE_SIZE}px` }}
                  onMouseDown={() => {
                    setIsMouseDown(true);
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
      </div>
    </div>
  );
}
