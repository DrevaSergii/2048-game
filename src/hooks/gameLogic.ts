const GRID_SIZE = 4;

export type Grid = number[][];
export type Direction = 'left' | 'right' | 'up' | 'down';

export type TileData = {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
};

// ─── legacy Grid-based API (kept for tests) ───────────────────────────────────

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

// ─── TileData-based API (used by the app) ────────────────────────────────────

let _nextId = 1;

function nextId(): number {
  return _nextId++;
}

function tilesToValueGrid(tiles: TileData[]): number[][] {
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  tiles.forEach(t => { grid[t.row][t.col] = t.value; });
  return grid;
}

function slideWithIds(
  tiles: TileData[],
  fixedAxis: 'row' | 'col',
  fixedValue: number,
  forward: boolean,
): { tiles: TileData[]; gained: number } {
  const movingAxis = fixedAxis === 'row' ? 'col' : 'row';
  const positions = forward ? [0, 1, 2, 3] : [3, 2, 1, 0];

  const sorted = [...tiles].sort((a, b) => {
    const aPos = a[movingAxis];
    const bPos = b[movingAxis];
    return forward ? aPos - bPos : bPos - aPos;
  });

  const result: TileData[] = [];
  let gained = 0;
  let slot = 0;
  let i = 0;

  while (i < sorted.length) {
    const targetPos = positions[slot];
    const newRow = fixedAxis === 'row' ? fixedValue : targetPos;
    const newCol = fixedAxis === 'col' ? fixedValue : targetPos;

    if (i + 1 < sorted.length && sorted[i].value === sorted[i + 1].value) {
      const merged = sorted[i].value * 2;
      gained += merged;
      result.push({ id: nextId(), value: merged, row: newRow, col: newCol, isNew: false, isMerged: true });
      i += 2;
    } else {
      result.push({ ...sorted[i], row: newRow, col: newCol, isNew: false, isMerged: false });
      i++;
    }
    slot++;
  }

  return { tiles: result, gained };
}

export function spawnRandomTile(tiles: TileData[]): TileData[] {
  const occupied = new Set(tiles.map(t => `${t.row}-${t.col}`));
  const empties: [number, number][] = [];

  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
      if (!occupied.has(`${r}-${c}`)) empties.push([r, c]);

  if (!empties.length) return tiles;

  const [row, col] = empties[Math.floor(Math.random() * empties.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  return [...tiles, { id: nextId(), value, row, col, isNew: true, isMerged: false }];
}

export function newGameTiles(): TileData[] {
  return spawnRandomTile(spawnRandomTile([]));
}

export function applyMoveWithTiles(
  tiles: TileData[],
  dir: Direction,
): { tiles: TileData[]; gained: number; changed: boolean } {
  const isHorizontal = dir === 'left' || dir === 'right';
  const forward = dir === 'left' || dir === 'up';
  const groupKey: 'row' | 'col' = isHorizontal ? 'row' : 'col';
  const fixedAxis: 'row' | 'col' = isHorizontal ? 'row' : 'col';

  let totalGained = 0;
  const newTiles: TileData[] = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    const group = tiles.filter(t => t[groupKey] === i);
    const { tiles: slid, gained } = slideWithIds(group, fixedAxis, i, forward);
    totalGained += gained;
    newTiles.push(...slid);
  }

  const oldGrid = tilesToValueGrid(tiles);
  const newGrid = tilesToValueGrid(newTiles);
  const changed = oldGrid.some((row, r) => row.some((v, c) => v !== newGrid[r][c]));

  return { tiles: newTiles, gained: totalGained, changed };
}

export function hasMoveTiles(tiles: TileData[]): boolean {
  if (tiles.length < GRID_SIZE * GRID_SIZE) return true;

  for (const tile of tiles) {
    const right = tiles.find(t => t.row === tile.row && t.col === tile.col + 1);
    if (right?.value === tile.value) return true;

    const below = tiles.find(t => t.row === tile.row + 1 && t.col === tile.col);
    if (below?.value === tile.value) return true;
  }

  return false;
}
