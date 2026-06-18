import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';

// With Math.random() === 0:
//   spawnTile always picks the first empty cell and spawns value 2
//   newGame() → [[2,2,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
//   move('left') merges both 2s → score 4, grid[0][0] = 4

describe('useGame', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => jest.restoreAllMocks());

  it('starts with exactly 2 tiles', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.grid.flat().filter(Boolean)).toHaveLength(2);
  });

  it('starts with score 0', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.score).toBe(0);
  });

  it('starts not over and without undo', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.isOver).toBe(false);
    expect(result.current.canUndo).toBe(false);
  });

  it('reads best from localStorage on init', () => {
    localStorage.setItem('2048best', '9999');
    const { result } = renderHook(() => useGame());
    expect(result.current.best).toBe(9999);
  });

  it('move that changes the board enables undo', () => {
    const { result } = renderHook(() => useGame());
    act(() => { result.current.move('left'); });
    expect(result.current.canUndo).toBe(true);
  });

  it('move left merges equal tiles and increments score', () => {
    const { result } = renderHook(() => useGame());
    // Initial: [[2,2,0,0],...]
    act(() => { result.current.move('left'); });
    expect(result.current.score).toBe(4);
    expect(result.current.grid[0][0]).toBe(4);
  });

  it('no-op move does not change state', () => {
    const { result } = renderHook(() => useGame());
    // Initial: [[2,2,0,0],...] — moving up changes nothing (both tiles already on top)
    const gridBefore = result.current.grid;
    act(() => { result.current.move('up'); });
    expect(result.current.score).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.grid).toBe(gridBefore);
  });

  it('undo reverts grid and score to previous state', () => {
    const { result } = renderHook(() => useGame());
    const gridBefore = result.current.grid;

    act(() => { result.current.move('left'); });
    expect(result.current.score).toBe(4);

    act(() => { result.current.undo(); });
    expect(result.current.score).toBe(0);
    expect(result.current.grid).toEqual(gridBefore);
    expect(result.current.canUndo).toBe(false);
  });

  it('undo is a no-op when canUndo is false', () => {
    const { result } = renderHook(() => useGame());
    const gridBefore = result.current.grid;
    act(() => { result.current.undo(); });
    expect(result.current.grid).toBe(gridBefore);
  });

  it('reset clears score and canUndo', () => {
    const { result } = renderHook(() => useGame());
    act(() => { result.current.move('left'); });
    act(() => { result.current.reset(); });
    expect(result.current.score).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.isOver).toBe(false);
  });

  it('reset preserves best score', () => {
    const { result } = renderHook(() => useGame());
    act(() => { result.current.move('left'); });
    const best = result.current.best;
    act(() => { result.current.reset(); });
    expect(result.current.best).toBe(best);
  });

  it('updates best and persists to localStorage when score exceeds it', () => {
    const { result } = renderHook(() => useGame());
    act(() => { result.current.move('left'); });
    expect(result.current.best).toBe(4);
    expect(localStorage.getItem('2048best')).toBe('4');
  });

  it('does not lower best score after reset', () => {
    localStorage.setItem('2048best', '1000');
    const { result } = renderHook(() => useGame());
    act(() => { result.current.move('left'); }); // score becomes 4, best stays 1000
    expect(result.current.best).toBe(1000);
  });
});
