import {
  emptyGrid, spawnTile, newGame, slideLeft, transpose, flipH, applyMove, hasMove,
  newGameTiles, spawnRandomTile, applyMoveWithTiles, hasMoveTiles,
} from './gameLogic';
import type { TileData } from './gameLogic';

// ─── legacy Grid-based tests ─────────────────────────────────────────────────

describe('emptyGrid', () => {
  it('returns 4×4 grid of zeros', () => {
    const grid = emptyGrid();
    expect(grid).toHaveLength(4);
    expect(grid.every(row => row.length === 4 && row.every(v => v === 0))).toBe(true);
  });
});

describe('spawnTile', () => {
  afterEach(() => jest.restoreAllMocks());

  it('adds exactly one tile to empty grid', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(spawnTile(emptyGrid()).flat().filter(Boolean)).toHaveLength(1);
  });

  it('spawns value 2 when random < 0.9', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(spawnTile(emptyGrid()).flat().find(Boolean)).toBe(2);
  });

  it('spawns value 4 when random >= 0.9', () => {
    jest.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.95);
    expect(spawnTile(emptyGrid()).flat().find(Boolean)).toBe(4);
  });

  it('does not mutate the original grid', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const grid = emptyGrid();
    spawnTile(grid);
    expect(grid.flat().every(v => v === 0)).toBe(true);
  });

  it('returns grid unchanged when full', () => {
    const full = Array.from({ length: 4 }, () => [2, 4, 8, 16]);
    expect(spawnTile(full)).toEqual(full);
  });
});

describe('newGame', () => {
  afterEach(() => jest.restoreAllMocks());

  it('places exactly 2 tiles', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(newGame().flat().filter(Boolean)).toHaveLength(2);
  });

  it('each tile is 2 or 4', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    newGame().flat().filter(Boolean).forEach(v => expect([2, 4]).toContain(v));
  });
});

describe('slideLeft', () => {
  it('returns zeros for empty row', () => {
    expect(slideLeft([0, 0, 0, 0])).toEqual({ row: [0, 0, 0, 0], gained: 0 });
  });

  it('slides tiles to the left', () => {
    expect(slideLeft([0, 0, 0, 2])).toEqual({ row: [2, 0, 0, 0], gained: 0 });
  });

  it('does not change already left-aligned row', () => {
    expect(slideLeft([2, 4, 8, 16])).toEqual({ row: [2, 4, 8, 16], gained: 0 });
  });

  it('merges two equal adjacent tiles', () => {
    expect(slideLeft([2, 2, 0, 0])).toEqual({ row: [4, 0, 0, 0], gained: 4 });
  });

  it('does not merge same tile twice in one move', () => {
    expect(slideLeft([2, 2, 2, 2])).toEqual({ row: [4, 4, 0, 0], gained: 8 });
  });

  it('merges first pair only when three equal tiles', () => {
    expect(slideLeft([2, 2, 2, 0])).toEqual({ row: [4, 2, 0, 0], gained: 4 });
  });

  it('slides and then merges', () => {
    expect(slideLeft([0, 2, 0, 2])).toEqual({ row: [4, 0, 0, 0], gained: 4 });
  });

  it('does not merge different values', () => {
    expect(slideLeft([2, 4, 2, 4])).toEqual({ row: [2, 4, 2, 4], gained: 0 });
  });

  it('merges high values correctly', () => {
    expect(slideLeft([1024, 1024, 0, 0])).toEqual({ row: [2048, 0, 0, 0], gained: 2048 });
  });
});

describe('transpose', () => {
  it('swaps rows and columns', () => {
    const g = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ];
    expect(transpose(g)).toEqual([
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15],
      [4, 8, 12, 16],
    ]);
  });

  it('transpose twice returns original', () => {
    const g = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    expect(transpose(transpose(g))).toEqual(g);
  });
});

describe('flipH', () => {
  it('reverses each row', () => {
    expect(flipH([[1, 2, 3, 4], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])).toEqual(
      [[4, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    );
  });

  it('flipH twice returns original', () => {
    const g = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
    expect(flipH(flipH(g))).toEqual(g);
  });
});

describe('applyMove', () => {
  const oneLeft = [
    [0, 0, 0, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  it('moves tile left', () => {
    const { grid, changed } = applyMove(oneLeft, 'left');
    expect(grid[0][0]).toBe(2);
    expect(grid[0][3]).toBe(0);
    expect(changed).toBe(true);
  });

  it('moves tile right', () => {
    const g = [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const { grid, changed } = applyMove(g, 'right');
    expect(grid[0][3]).toBe(2);
    expect(grid[0][0]).toBe(0);
    expect(changed).toBe(true);
  });

  it('moves tile up', () => {
    const g = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 0, 0]];
    const { grid, changed } = applyMove(g, 'up');
    expect(grid[0][0]).toBe(2);
    expect(grid[3][0]).toBe(0);
    expect(changed).toBe(true);
  });

  it('moves tile down', () => {
    const g = [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const { grid, changed } = applyMove(g, 'down');
    expect(grid[3][0]).toBe(2);
    expect(grid[0][0]).toBe(0);
    expect(changed).toBe(true);
  });

  it('merges equal tiles and returns gained score', () => {
    const g = [[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    const { grid, gained } = applyMove(g, 'left');
    expect(grid[0][0]).toBe(4);
    expect(gained).toBe(4);
  });

  it('reports changed=false when nothing moves', () => {
    const g = [[2, 4, 8, 16], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    expect(applyMove(g, 'left').changed).toBe(false);
  });

  it('accumulates score from multiple merges', () => {
    const g = [
      [2, 2, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { gained } = applyMove(g, 'left');
    expect(gained).toBe(12); // 4 + 8
  });
});

describe('hasMove', () => {
  it('returns true when empty cells exist', () => {
    const g = [[2, 4, 8, 16], [32, 64, 128, 256], [512, 1024, 2048, 4096], [0, 0, 0, 0]];
    expect(hasMove(g)).toBe(true);
  });

  it('returns true when horizontal merge possible', () => {
    const g = [
      [2, 2, 4, 8],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ];
    expect(hasMove(g)).toBe(true);
  });

  it('returns true when vertical merge possible', () => {
    const g = [
      [2, 4, 8, 16],
      [2, 8, 16, 32],
      [4, 16, 32, 64],
      [8, 32, 64, 128],
    ];
    expect(hasMove(g)).toBe(true);
  });

  it('returns false when no moves possible', () => {
    const g = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(hasMove(g)).toBe(false);
  });
});

// ─── TileData-based tests ─────────────────────────────────────────────────────

const tile = (id: number, value: number, row: number, col: number): TileData => ({
  id, value, row, col, isNew: false, isMerged: false,
});

describe('spawnRandomTile', () => {
  afterEach(() => jest.restoreAllMocks());

  it('adds one tile to an empty array', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(spawnRandomTile([])).toHaveLength(1);
  });

  it('spawns value 2 when random < 0.9', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(spawnRandomTile([])[0].value).toBe(2);
  });

  it('spawns value 4 when random >= 0.9', () => {
    jest.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.95);
    expect(spawnRandomTile([])[0].value).toBe(4);
  });

  it('sets isNew=true on the spawned tile', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(spawnRandomTile([])[0].isNew).toBe(true);
  });

  it('does not spawn on an occupied cell', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const existing = [tile(1, 2, 0, 0)];
    const result = spawnRandomTile(existing);
    expect(result).toHaveLength(2);
    expect(result.find(t => t.row === 0 && t.col === 0)?.value).toBe(2);
  });

  it('returns unchanged array when grid is full', () => {
    const full: TileData[] = [];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        full.push(tile(r * 4 + c + 1, 2, r, c));
    expect(spawnRandomTile(full)).toEqual(full);
  });
});

describe('newGameTiles', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns exactly 2 tiles', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(newGameTiles()).toHaveLength(2);
  });

  it('all tiles have value 2 or 4', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    newGameTiles().forEach(t => expect([2, 4]).toContain(t.value));
  });
});

describe('applyMoveWithTiles', () => {
  it('moves tile left', () => {
    const tiles = [tile(1, 2, 0, 3)];
    const { tiles: result, changed } = applyMoveWithTiles(tiles, 'left');
    expect(result.find(t => t.value === 2)?.col).toBe(0);
    expect(changed).toBe(true);
  });

  it('moves tile right', () => {
    const tiles = [tile(1, 2, 0, 0)];
    const { tiles: result, changed } = applyMoveWithTiles(tiles, 'right');
    expect(result.find(t => t.value === 2)?.col).toBe(3);
    expect(changed).toBe(true);
  });

  it('moves tile up', () => {
    const tiles = [tile(1, 2, 3, 0)];
    const { tiles: result, changed } = applyMoveWithTiles(tiles, 'up');
    expect(result.find(t => t.value === 2)?.row).toBe(0);
    expect(changed).toBe(true);
  });

  it('moves tile down', () => {
    const tiles = [tile(1, 2, 0, 0)];
    const { tiles: result, changed } = applyMoveWithTiles(tiles, 'down');
    expect(result.find(t => t.value === 2)?.row).toBe(3);
    expect(changed).toBe(true);
  });

  it('merges equal tiles and returns gained score', () => {
    const tiles = [tile(1, 2, 0, 0), tile(2, 2, 0, 1)];
    const { tiles: result, gained, changed } = applyMoveWithTiles(tiles, 'left');
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(4);
    expect(result[0].isMerged).toBe(true);
    expect(gained).toBe(4);
    expect(changed).toBe(true);
  });

  it('reports changed=false when nothing moves', () => {
    const tiles = [tile(1, 2, 0, 0), tile(2, 4, 0, 1), tile(3, 8, 0, 2), tile(4, 16, 0, 3)];
    expect(applyMoveWithTiles(tiles, 'left').changed).toBe(false);
  });

  it('accumulates score from multiple merges', () => {
    const tiles = [
      tile(1, 2, 0, 0), tile(2, 2, 0, 1),
      tile(3, 4, 0, 2), tile(4, 4, 0, 3),
    ];
    const { gained } = applyMoveWithTiles(tiles, 'left');
    expect(gained).toBe(12); // 4 + 8
  });

  it('preserves tile ID for unmoved tiles', () => {
    const tiles = [tile(99, 2, 0, 1)];
    const { tiles: result } = applyMoveWithTiles(tiles, 'left');
    expect(result[0].id).toBe(99);
  });

  it('clears isNew and isMerged flags on existing tiles', () => {
    const tiles = [{ ...tile(1, 2, 0, 1), isNew: true, isMerged: true }];
    const { tiles: result } = applyMoveWithTiles(tiles, 'left');
    expect(result[0].isNew).toBe(false);
    expect(result[0].isMerged).toBe(false);
  });
});

describe('hasMoveTiles', () => {
  it('returns true when empty cells exist', () => {
    const tiles = [tile(1, 2, 0, 0)];
    expect(hasMoveTiles(tiles)).toBe(true);
  });

  it('returns true when horizontal merge possible', () => {
    const full: TileData[] = [];
    let id = 1;
    const vals = [
      [2, 2, 4, 8],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        full.push(tile(id++, vals[r][c], r, c));
    expect(hasMoveTiles(full)).toBe(true);
  });

  it('returns true when vertical merge possible', () => {
    const full: TileData[] = [];
    let id = 1;
    const vals = [
      [2, 4, 8, 16],
      [2, 8, 16, 32],
      [4, 16, 32, 64],
      [8, 32, 64, 128],
    ];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        full.push(tile(id++, vals[r][c], r, c));
    expect(hasMoveTiles(full)).toBe(true);
  });

  it('returns false when no moves possible', () => {
    const full: TileData[] = [];
    let id = 1;
    const vals = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        full.push(tile(id++, vals[r][c], r, c));
    expect(hasMoveTiles(full)).toBe(false);
  });
});
