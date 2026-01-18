'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Eraser, Square, User, Rabbit, Ghost, PiggyBank, type LucideIcon, ArrowUp } from 'lucide-react';
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

const Joystick = ({ onMove, onEnd }: { onMove: (x: number) => void; onEnd: () => void; }) => {
    const [isDragging, setIsDragging] = useState(false);
    const stickRef = useRef<HTMLDivElement>(null);
    const baseRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!baseRef.current || !stickRef.current) return;

        const baseRect = baseRef.current.getBoundingClientRect();
        const centerX = baseRect.left + baseRect.width / 2;
        const maxDist = baseRect.width / 2 - stickRef.current.offsetWidth / 2;

        let dx = clientX - centerX;

        if (Math.abs(dx) > maxDist) {
            dx = Math.sign(dx) * maxDist;
        }

        stickRef.current.style.transform = `translateX(${dx}px)`;
        
        const x = dx / maxDist;
        onMove(x);
    }, [onMove]);

    const handleEnd = useCallback(() => {
        setIsDragging(false);
        if (stickRef.current) {
            stickRef.current.style.transform = 'translateX(0px)';
        }
        onEnd();
    }, [onEnd]);

    const handleStart = () => {
        setIsDragging(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => handleMove(e.clientX), [handleMove]);
    const handleTouchMove = useCallback((e: TouchEvent) => handleMove(e.touches[0].clientX), [handleMove]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

    return (
        <div ref={baseRef} className="w-40 h-20 rounded-full bg-secondary/50 flex items-center justify-center relative p-2">
            <div
                ref={stickRef}
                className="w-16 h-16 rounded-full bg-secondary border-2 border-input shadow-lg cursor-grab active:cursor-grabbing transition-transform duration-75"
                onMouseDown={handleStart}
                onTouchStart={handleStart}
            ></div>
        </div>
    );
};


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
    
    setGrid(currentGrid => {
      const currentCell = currentGrid[row][col];
      const newCell = {...currentCell};
      let changed = false;

      if (tool === 'draw') {
        if (newCell.color !== selectedBlock) {
          newCell.color = selectedBlock;
          changed = true;
        }
      } else if (tool === 'erase') {
        if (newCell.color !== null) {
          newCell.color = null;
          changed = true;
        }
      }

      if (changed) {
        const newGrid = [...currentGrid];
        newGrid[row] = [...currentGrid[row]];
        newGrid[row][col] = newCell;
        return newGrid;
      }

      return currentGrid;
    });
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
    // --- Player Physics ---
    setPlayer(p => {
        let { x, y, vx, vy, isOnGround } = { ...p };

        // Horizontal movement from input
        if (keys.current['a'] || keys.current['arrowleft']) {
            vx = -MOVE_SPEED;
        } else if (keys.current['d'] || keys.current['arrowright']) {
            vx = MOVE_SPEED;
        } else {
            vx = 0;
        }
        
        // Jumping from input
        if ((keys.current['w'] || keys.current['arrowup'] || keys.current[' ']) && isOnGround) {
            vy = JUMP_FORCE;
        }

        // Apply gravity
        vy += GRAVITY;

        // --- Optimized X-axis collision ---
        x += vx;
        const playerStartX = Math.floor(x / TILE_SIZE);
        const playerEndX = Math.floor((x + TILE_SIZE - 1) / TILE_SIZE);
        const playerStartY = Math.floor(y / TILE_SIZE);
        const playerEndY = Math.floor((y + TILE_SIZE - 1) / TILE_SIZE);

        for (let row = playerStartY; row <= playerEndY; row++) {
            for (let col = playerStartX; col <= playerEndX; col++) {
                if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && grid[row][col].color) {
                    if (vx > 0) { // Moving right
                        x = col * TILE_SIZE - TILE_SIZE;
                    } else if (vx < 0) { // Moving left
                        x = col * TILE_SIZE + TILE_SIZE;
                    }
                    vx = 0;
                    break;
                }
            }
            if (vx === 0) break;
        }

        // --- Optimized Y-axis collision ---
        isOnGround = false;
        y += vy;
        const playerAfterMoveStartX = Math.floor(x / TILE_SIZE);
        const playerAfterMoveEndX = Math.floor((x + TILE_SIZE - 1) / TILE_SIZE);
        const playerAfterMoveStartY = Math.floor(y / TILE_SIZE);
        const playerAfterMoveEndY = Math.floor((y + TILE_SIZE - 1) / TILE_SIZE);
        
        for (let row = playerAfterMoveStartY; row <= playerAfterMoveEndY; row++) {
            for (let col = playerAfterMoveStartX; col <= playerAfterMoveEndX; col++) {
                if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && grid[row][col].color) {
                    if (vy > 0) { // Moving down
                        y = row * TILE_SIZE - TILE_SIZE;
                        isOnGround = true;
                    } else if (vy < 0) { // Moving up
                        y = row * TILE_SIZE + TILE_SIZE;
                    }
                    vy = 0;
                    break;
                }
            }
            if (vy === 0) break;
        }
        
        // World bounds
        if (x < 0) x = 0;
        if (x + TILE_SIZE > GRID_SIZE * TILE_SIZE) x = GRID_SIZE * TILE_SIZE - TILE_SIZE;
        if (y > GRID_SIZE * TILE_SIZE) { // Fell out of world, reset
            return { x: TILE_SIZE * 3, y: 0, vx: 0, vy: 0, isOnGround: false };
        }

        return { x, y, vx, vy, isOnGround };
    });

    // --- Mobs Physics ---
    setMobs(prevMobs => 
        prevMobs.map(m => {
            let { x, y, vx, vy, isOnGround } = { ...m };

            vy += GRAVITY;

            // X-axis (mobs don't have horizontal movement yet)
            // ...

            // Y-axis
            isOnGround = false;
            y += vy;
            const mobStartY = Math.floor(y / TILE_SIZE);
            const mobEndY = Math.floor((y + TILE_SIZE - 1) / TILE_SIZE);
            const mobStartX = Math.floor(x / TILE_SIZE);
            const mobEndX = Math.floor((x + TILE_SIZE - 1) / TILE_SIZE);

            for (let row = mobStartY; row <= mobEndY; row++) {
              for (let col = mobStartX; col <= mobEndX; col++) {
                  if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && grid[row][col].color) {
                      if (vy > 0) {
                          y = row * TILE_SIZE - TILE_SIZE;
                          isOnGround = true;
                      } else if (vy < 0) {
                          y = row * TILE_SIZE + TILE_SIZE;
                      }
                      vy = 0;
                      break;
                  }
              }
              if (vy === 0) break;
            }
            
            if (y > GRID_SIZE * TILE_SIZE) {
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

  const handleJoystickMove = useCallback((x: number) => {
    if (x > 0.1) {
        keys.current['d'] = true;
        keys.current['arrowright'] = true;
        keys.current['a'] = false;
        keys.current['arrowleft'] = false;
    } else if (x < -0.1) {
        keys.current['a'] = true;
        keys.current['arrowleft'] = true;
        keys.current['d'] = false;
        keys.current['arrowright'] = false;
    } else {
        keys.current['a'] = false;
        keys.current['arrowleft'] = false;
        keys.current['d'] = false;
        keys.current['arrowright'] = false;
    }
  }, []);

  const handleJoystickEnd = useCallback(() => {
    keys.current['a'] = false;
    keys.current['arrowleft'] = false;
    keys.current['d'] = false;
    keys.current['arrowright'] = false;
  }, []);

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
                <Joystick onMove={handleJoystickMove} onEnd={handleJoystickEnd} />
                <Button
                    variant="secondary"
                    className="w-20 h-20 rounded-full opacity-80"
                    onTouchStart={() => { keys.current['w'] = true; keys.current[' '] = true; keys.current['arrowup'] = true; }}
                    onTouchEnd={() => { keys.current['w'] = false; keys.current[' '] = false; keys.current['arrowup'] = false; }}
                    onMouseDown={() => { keys.current['w'] = true; keys.current[' '] = true; keys.current['arrowup'] = true; }}
                    onMouseUp={() => { keys.current['w'] = false; keys.current[' '] = false; keys.current['arrowup'] = false; }}
                >
                    <ArrowUp className="h-10 w-10" />
                </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
