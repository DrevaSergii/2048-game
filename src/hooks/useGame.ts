import { useState, useEffect, useCallback } from 'react';
import { TileData, Direction, newGameTiles, spawnRandomTile, applyMoveWithTiles, hasMoveTiles } from './gameLogic';

export type { Direction };

type UndoSnapshot = {
  tiles: TileData[];
  score: number;
};

export interface GameAPI {
  tiles: TileData[];
  score: number;
  best: number;
  isOver: boolean;
  canUndo: boolean;
  move: (dir: Direction) => void;
  reset: () => void;
  undo: () => void;
}

export function useGame(): GameAPI {
  const [tiles, setTiles] = useState<TileData[]>(newGameTiles);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('2048best') || '0', 10));
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null);
  const [isOver, setIsOver] = useState(false);

  const move = useCallback((dir: Direction) => {
    if (isOver) return;

    const { tiles: next, gained, changed } = applyMoveWithTiles(tiles, dir);
    if (!changed) return;

    const spawned = spawnRandomTile(next);
    const newScore = score + gained;
    const newBest = Math.max(best, newScore);

    setUndoSnapshot({ tiles, score });
    setTiles(spawned);
    setScore(newScore);
    setBest(newBest);
    if (newBest > best) localStorage.setItem('2048best', String(newBest));
    if (!hasMoveTiles(spawned)) setIsOver(true);
  }, [tiles, score, best, isOver]);

  const reset = useCallback(() => {
    setTiles(newGameTiles());
    setScore(0);
    setUndoSnapshot(null);
    setIsOver(false);
  }, []);

  const undo = useCallback(() => {
    if (!undoSnapshot) return;
    setTiles(undoSnapshot.tiles);
    setScore(undoSnapshot.score);
    setUndoSnapshot(null);
    setIsOver(false);
  }, [undoSnapshot]);

  useEffect(() => {
    const KEY_TO_DIRECTION: Record<string, Direction> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_TO_DIRECTION[e.key];
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return { tiles, score, best, isOver, canUndo: !!undoSnapshot, move, reset, undo };
}
