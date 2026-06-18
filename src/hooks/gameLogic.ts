const GRID_SIZE = 4;

export type Grid = number[][];
export type Direction = 'left' | 'right' | 'up' | 'down';

export function emptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

export function spawnTile(grid: Grid): Grid {
  const empties: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
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
      const merged = vals[i] * 2;
      result.push(merged);
      gained += merged;
      i += 2;
    } else {
      result.push(vals[i]);
      i++;
    }
  }
  while (result.length < GRID_SIZE) result.push(0);
  return { row: result, gained };
}

export function transpose(grid: Grid): Grid {
  return grid[0].map((_, c) => grid.map(row => row[c]));
}

export function flipH(grid: Grid): Grid {
  return grid.map(row => [...row].reverse());
}

export function applyMove(
  grid: Grid,
  dir: Direction,
): { grid: Grid; gained: number; changed: boolean } {
  let transformed = grid;
  if (dir === 'right') transformed = flipH(grid);
  else if (dir === 'up') transformed = transpose(grid);
  else if (dir === 'down') transformed = flipH(transpose(grid));

  let gained = 0;
  const moved = transformed.map(row => {
    const { row: slid, gained: delta } = slideLeft(row);
    gained += delta;
    return slid;
  });

  let result = moved;
  if (dir === 'right') result = flipH(moved);
  else if (dir === 'up') result = transpose(moved);
  else if (dir === 'down') result = transpose(flipH(moved));

  const changed = grid.some((row, r) => row.some((val, c) => val !== result[r][c]));
  return { grid: result, gained, changed };
}

export function hasMove(grid: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) return true;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}
