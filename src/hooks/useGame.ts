import { useState, useEffect, useCallback } from 'react';
import { Grid, Direction, newGame, spawnTile, applyMove, hasMove } from './gameLogic';

export type { Direction };

export interface GameAPI {
  grid: Grid;
  score: number;
  best: number;
  over: boolean;
  canUndo: boolean;
  move: (dir: Direction) => void;
  reset: () => void;
  undo: () => void;
}

export function useGame(): GameAPI {
  const [grid, setGrid] = useState<Grid>(newGame);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('2048best') || '0', 10));
  const [prev, setPrev] = useState<{ grid: Grid; score: number } | null>(null);
  const [over, setOver] = useState(false);

  const move = useCallback((dir: Direction) => {
    if (over) return;
    const { grid: next, gained, changed } = applyMove(grid, dir);
    if (!changed) return;

    const spawned = spawnTile(next);
    const newScore = score + gained;
    const newBest = Math.max(best, newScore);

    setPrev({ grid, score });
    setGrid(spawned);
    setScore(newScore);
    setBest(newBest);
    if (newBest > best) localStorage.setItem('2048best', String(newBest));
    if (!hasMove(spawned)) setOver(true);
  }, [grid, score, best, over]);

  const reset = useCallback(() => {
    setGrid(newGame());
    setScore(0);
    setPrev(null);
    setOver(false);
  }, []);

  const undo = useCallback(() => {
    if (!prev) return;
    setGrid(prev.grid);
    setScore(prev.score);
    setPrev(null);
    setOver(false);
  }, [prev]);

  useEffect(() => {
    const dirs: Record<string, Direction> = {
      ArrowLeft: 'left', ArrowRight: 'right',
      ArrowUp: 'up', ArrowDown: 'down',
    };
    const onKey = (e: KeyboardEvent) => {
      const dir = dirs[e.key];
      if (dir) { e.preventDefault(); move(dir); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  return { grid, score, best, over, canUndo: !!prev, move, reset, undo };
}
