'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eraser, Square, User, Rabbit, Ghost, PiggyBank, type LucideIcon, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { type BlockColor, blockStyles, blockTypes } from '@/app/studio/components/block-palette';

const GRID_SIZE = 20;
const TILE_SIZE = 30; // in pixels
const GRAVITY = 0.4;
const MOVE_SPEED = 3;
const JUMP_FORCE = -8;

// Mob types and data
export type MobType = 'pig' | 'zombie' | 'creeper';

export const mobIcons: Record<MobType, LucideIcon> = {
  pig: PiggyBank,
  zombie: User,
  creeper: Ghost,
};

export const mobNames: Record<MobType, string> = {
    pig: "Pig",
    zombie: "Zombie",
    creeper: "Creeper"
}

export const mobTypes: MobType[] = [
  'pig',
  'zombie',
  'creeper',
];

type Tool = 'draw' | 'erase' | 'mob';

type Cell = {
  color: BlockColor | null;
};

type PlayerState = {
  x: number; // position in pixels
  y: number; // position in pixels
  vx: number; // velocity x
  vy: number; // velocity y
  isOnGround: boolean;
};

type MobState = {
  id: number;
  type: MobType;
} & PlayerState;

const initialGrid = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => ({ color: null }))
);

export default function TestingGroundPage() {
  const [grid, setGrid] = useState<Cell[][]>(initialGrid);
  const [selectedBlock, setSelectedBlock] = useState<BlockColor>('stone');
  const [selectedMob, setSelectedMob] = useState<MobType>('pig');
  const [tool, setTool] = useState<Tool>('draw');
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  const [player, setPlayer] = useState<PlayerState>({ x: TILE_SIZE * 3, y: 0, vx: 0, vy: 0, isOnGround: false });
  const [mobs, setMobs] = useState<MobState[]>([]);
  const keys = useRef<{ [key: string]: boolean }>({});
  const gameLoopId = useRef<number>();
  const nextMobId = useRef(0);

  const handleCellInteraction = (row: number, col: number) => {
    if (tool === 'mob') {
      const newMob: MobState = {
        id: nextMobId.current++,
        type: selectedMob,
        x: col * TILE_SIZE,
        y: row * TILE_SIZE,
        vx: 0,
        vy: 0,
        isOnGround: false,
      };
      setMobs(prev => [...prev, newMob]);
      return;
    }
    
    const newGrid = grid.map(r => r.map(c => ({...c})));
    let changed = false;
    const cell = newGrid[row][col];

    if (tool === 'draw') {
      if (cell.color !== 'bedrock' && cell.color !== selectedBlock) {
        cell.color = selectedBlock;
        changed = true;
      }
    } else if (tool === 'erase') {
      if (cell.color !== 'bedrock' && cell.color !== null) {
        cell.color = null;
        changed = true;
      }
    }

    if (changed) {
      setGrid(newGrid);
    }
  };
  
  const resetWorld = () => {
    setGrid(initialGrid);
    setPlayer({ x: TILE_SIZE * 3, y: 0, vx: 0, vy: 0, isOnGround: false });
    setMobs([]);
  }

  // Keyboard input handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const gameLoop = useCallback(() => {
    setPlayer(p => {
        let { x, y, vx, vy, isOnGround } = { ...p };

        // Horizontal movement
        if (keys.current['a'] || keys.current['arrowleft']) {
            vx = -MOVE_SPEED;
        } else if (keys.current['d'] || keys.current['arrowright']) {
            vx = MOVE_SPEED;
        } else {
            vx = 0;
        }
        
        // Jumping
        if ((keys.current['w'] || keys.current['arrowup'] || keys.current[' ']) && isOnGround) {
            vy = JUMP_FORCE;
            isOnGround = false;
        }

        // Apply gravity
        vy += GRAVITY;

        // --- Collision Detection ---
        
        // X-axis movement and collision
        x += vx;
        const playerRectX = { left: x, right: x + TILE_SIZE, top: y, bottom: y + TILE_SIZE };
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (grid[row][col].color) {
                    const blockRect = { left: col * TILE_SIZE, right: col * TILE_SIZE + TILE_SIZE, top: row * TILE_SIZE, bottom: row * TILE_SIZE + TILE_SIZE };
                    if (playerRectX.right > blockRect.left && playerRectX.left < blockRect.right && playerRectX.bottom > blockRect.top && playerRectX.top < blockRect.bottom) {
                        if (vx > 0) { x = blockRect.left - TILE_SIZE; } 
                        else if (vx < 0) { x = blockRect.right; }
                        vx = 0;
                    }
                }
            }
        }

        // Y-axis movement and collision
        isOnGround = false;
        y += vy;
        const playerRectY = { left: x, right: x + TILE_SIZE, top: y, bottom: y + TILE_SIZE };
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (grid[row][col].color) {
                    const blockRect = { left: col * TILE_SIZE, right: col * TILE_SIZE + TILE_SIZE, top: row * TILE_SIZE, bottom: row * TILE_SIZE + TILE_SIZE };
                    if (playerRectY.right > blockRect.left && playerRectY.left < blockRect.right && playerRectY.bottom > blockRect.top && playerRectY.top < blockRect.bottom) {
                        if (vy > 0) { 
                            y = blockRect.top - TILE_SIZE;
                            isOnGround = true;
                        } else if (vy < 0) {
                             y = blockRect.bottom;
                        }
                        vy = 0;
                    }
                }
            }
        }
        
        // World bounds
        if (x < 0) x = 0;
        if (x + TILE_SIZE > GRID_SIZE * TILE_SIZE) x = GRID_SIZE * TILE_SIZE - TILE_SIZE;
        if (y > GRID_SIZE * TILE_SIZE) { // Fell out of world, reset
            return { x: TILE_SIZE * 3, y: 0, vx: 0, vy: 0, isOnGround: false };
        }

        return { x, y, vx, vy, isOnGround };
    });

    setMobs(prevMobs => 
        prevMobs.map(m => {
            let { x, y, vx, vy, isOnGround } = { ...m };

            // Apply gravity
            vy += GRAVITY;

            // Y-axis movement and collision for mob
            isOnGround = false;
            y += vy;
            const mobRectY = { left: x, right: x + TILE_SIZE, top: y, bottom: y + TILE_SIZE };
            for (let row = 0; row < GRID_SIZE; row++) {
                for (let col = 0; col < GRID_SIZE; col++) {
                    if (grid[row][col].color) {
                        const blockRect = { left: col * TILE_SIZE, right: col * TILE_SIZE + TILE_SIZE, top: row * TILE_SIZE, bottom: row * TILE_SIZE + TILE_SIZE };
                        if (mobRectY.right > blockRect.left && mobRectY.left < blockRect.right && mobRectY.bottom > blockRect.top && mobRectY.top < blockRect.bottom) {
                            if (vy > 0) { 
                                y = blockRect.top - TILE_SIZE;
                                isOnGround = true;
                            } else if (vy < 0) {
                                 y = blockRect.bottom;
                            }
                            vy = 0;
                        }
                    }
                }
            }
            
            // World bounds
            if (y > GRID_SIZE * TILE_SIZE) { // Fell out of world, mark for removal
                return null;
            }

            return { ...m, x, y, vx, vy, isOnGround };
        }).filter(Boolean) as MobState[]
    );

    gameLoopId.current = requestAnimationFrame(gameLoop);
  }, [grid]);

  useEffect(() => {
    gameLoopId.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopId.current) {
        cancelAnimationFrame(gameLoopId.current);
      }
    }
  }, [gameLoop]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Physics Testing Ground</h1>
        <p className="text-muted-foreground">
          Build a level, place some mobs, and test the physics! Use A/D or Arrow Keys to move, and W, Space, or Up Arrow to jump.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
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
                    <Button 
                        variant={tool === 'mob' ? 'secondary' : 'outline'} 
                        size="icon" 
                        onClick={() => setTool('mob')}
                        aria-label="Mob tool"
                    >
                        <Rabbit />
                    </Button>
                 </div>
              </div>
              
              {tool === 'draw' && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Blocks</h3>
                  <div className="grid grid-cols-5 gap-x-2 gap-y-3">
                    {blockTypes.map(b_type => (
                      <div key={b_type} className="flex flex-col items-center gap-1.5">
                        <button
                          onClick={() => setSelectedBlock(b_type)}
                          className={cn(
                            'w-10 h-10 rounded-md border-2 border-r-[3px] border-b-[3px] transition-all',
                            blockStyles[b_type],
                            selectedBlock === b_type && tool === 'draw'
                              ? 'ring-2 ring-offset-background ring-accent'
                              : 'hover:ring-1 hover:ring-accent'
                          )}
                          aria-label={`Select ${b_type} block`}
                        />
                        <p className="text-xs capitalize text-muted-foreground">{b_type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tool === 'mob' && (
                <div className="space-y-2">
                    <h3 className="font-semibold">Mobs</h3>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                        {mobTypes.map(mobType => {
                            const Icon = mobIcons[mobType];
                            return (
                                <div key={mobType} className="flex flex-col items-center gap-1.5">
                                    <button
                                        onClick={() => setSelectedMob(mobType)}
                                        className={cn(
                                        'w-12 h-12 rounded-md border-2 flex items-center justify-center bg-secondary transition-all',
                                        selectedMob === mobType
                                            ? 'ring-2 ring-offset-background ring-accent border-accent'
                                            : 'hover:ring-1 hover:ring-accent border-input'
                                        )}
                                        aria-label={`Select ${mobType}`}
                                    >
                                        <Icon className="w-8 h-8 text-secondary-foreground" />
                                    </button>
                                    <p className="text-xs capitalize text-muted-foreground">{mobNames[mobType]}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
              )}

               <Button onClick={resetWorld} variant="destructive" className="w-full">
                Reset World
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 flex justify-center items-start">
          <div
            className="relative grid border-r border-b border-muted bg-grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
              width: `${GRID_SIZE * TILE_SIZE}px`,
              cursor: tool === 'erase' ? 'crosshair' : 'copy'
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
                      ? `${blockStyles[cell.color]} border-r-[3px] border-b-[3px]`
                      : 'border-transparent bg-transparent hover:bg-secondary/50'
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
            <div
              className="absolute bg-accent rounded-sm border-2 border-accent-foreground flex items-center justify-center"
              style={{
                  left: player.x,
                  top: player.y,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  transition: 'left 0.05s linear, top 0.05s linear'
              }}
            >
              <User className="w-5 h-5 text-accent-foreground" />
            </div>
            {mobs.map(mob => {
                const MobIcon = mobIcons[mob.type];
                return (
                    <div
                        key={mob.id}
                        className="absolute bg-rose-500 rounded-sm border-2 border-rose-700 flex items-center justify-center"
                        style={{
                            left: mob.x,
                            top: mob.y,
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                            transition: 'left 0.05s linear, top 0.05s linear'
                        }}
                    >
                        <MobIcon className="w-5 h-5 text-white" />
                    </div>
                );
            })}
            <div className="md:hidden absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        className="w-16 h-16 rounded-full opacity-80"
                        onTouchStart={() => keys.current['a'] = true}
                        onTouchEnd={() => {keys.current['a'] = false;}}
                        onMouseDown={() => keys.current['a'] = true}
                        onMouseUp={() => {keys.current['a'] = false;}}
                    >
                        <ArrowLeft className="h-8 w-8" />
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-16 h-16 rounded-full opacity-80"
                        onTouchStart={() => keys.current['d'] = true}
                        onTouchEnd={() => {keys.current['d'] = false;}}
                        onMouseDown={() => keys.current['d'] = true}
                        onMouseUp={() => {keys.current['d'] = false;}}
                    >
                        <ArrowRight className="h-8 w-8" />
                    </Button>
                </div>
                <Button
                    variant="secondary"
                    className="w-16 h-16 rounded-full opacity-80"
                    onTouchStart={() => keys.current['w'] = true}
                    onTouchEnd={() => {keys.current['w'] = false;}}
                    onMouseDown={() => keys.current['w'] = true}
                    onMouseUp={() => {keys.current['w'] = false;}}
                >
                    <ArrowUp className="h-8 w-8" />
                </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
