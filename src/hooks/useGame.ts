import { useState, useEffect, useCallback } from 'react';

const SIZE = 4;

type Grid = number[][];

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function spawnTile(grid: Grid): Grid {
  const empties: [number, number][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] === 0) empties.push([r, c]);

  if (!empties.length) return grid;

  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const next = grid.map(row => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function newGame(): Grid {
  return spawnTile(spawnTile(emptyGrid()));
}

function slideLeft(row: number[]): { row: number[]; gained: number } {
  const vals = row.filter(Boolean);
  const result: number[] = [];
  let gained = 0;
  let i = 0;
  while (i < vals.length) {
    if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
      const v = vals[i] * 2;
      result.push(v);
      gained += v;
      i += 2;
    } else {
      result.push(vals[i]);
      i++;
    }
  }
  while (result.length < SIZE) result.push(0);
  return { row: result, gained };
}

function transpose(g: Grid): Grid {
  return g[0].map((_, c) => g.map(row => row[c]));
}

function flipH(g: Grid): Grid {
  return g.map(row => [...row].reverse());
}

export type Direction = 'left' | 'right' | 'up' | 'down';

function applyMove(grid: Grid, dir: Direction): { grid: Grid; gained: number; changed: boolean } {
  let g = grid;
  if (dir === 'right') g = flipH(g);
  else if (dir === 'up') g = transpose(g);
  else if (dir === 'down') g = flipH(transpose(g));

  let gained = 0;
  const moved = g.map(row => {
    const { row: r, gained: d } = slideLeft(row);
    gained += d;
    return r;
  });

  let result = moved;
  if (dir === 'right') result = flipH(moved);
  else if (dir === 'up') result = transpose(moved);
  else if (dir === 'down') result = transpose(flipH(moved));

  const changed = grid.some((row, r) => row.some((v, c) => v !== result[r][c]));
  return { grid: result, gained, changed };
}

function hasMove(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}

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
