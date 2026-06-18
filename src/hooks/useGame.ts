import { useState, useEffect, useCallback } from 'react';
import { Grid, Direction, newGame, spawnTile, applyMove, hasMove } from './gameLogic';

export type { Direction };

type UndoSnapshot = {
  grid: Grid;
  score: number;
};

export interface GameAPI {
  grid: Grid;
  score: number;
  best: number;
  isOver: boolean;
  canUndo: boolean;
  move: (dir: Direction) => void;
  reset: () => void;
  undo: () => void;
}

export function useGame(): GameAPI {
  const [grid, setGrid] = useState<Grid>(newGame);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('2048best') || '0', 10));
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null);
  const [isOver, setIsOver] = useState(false);

  const move = useCallback((dir: Direction) => {
    if (isOver) return;

    const { grid: next, gained, changed } = applyMove(grid, dir);
    if (!changed) return;

    const spawned = spawnTile(next);
    const newScore = score + gained;
    const newBest = Math.max(best, newScore);

    setUndoSnapshot({ grid, score });
    setGrid(spawned);
    setScore(newScore);
    setBest(newBest);
    if (newBest > best) localStorage.setItem('2048best', String(newBest));
    if (!hasMove(spawned)) setIsOver(true);
  }, [grid, score, best, isOver]);

  const reset = useCallback(() => {
    setGrid(newGame());
    setScore(0);
    setUndoSnapshot(null);
    setIsOver(false);
  }, []);

  const undo = useCallback(() => {
    if (!undoSnapshot) return;
    setGrid(undoSnapshot.grid);
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

  return { grid, score, best, isOver, canUndo: !!undoSnapshot, move, reset, undo };
}
