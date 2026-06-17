const SIZE = 4;

export type Grid = number[][];
export type Direction = 'left' | 'right' | 'up' | 'down';

export function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

export function spawnTile(grid: Grid): Grid {
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

export function newGame(): Grid {
  return spawnTile(spawnTile(emptyGrid()));
}

export function slideLeft(row: number[]): { row: number[]; gained: number } {
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

export function transpose(g: Grid): Grid {
  return g[0].map((_, c) => g.map(row => row[c]));
}

export function flipH(g: Grid): Grid {
  return g.map(row => [...row].reverse());
}

export function applyMove(grid: Grid, dir: Direction): { grid: Grid; gained: number; changed: boolean } {
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

export function hasMove(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}
