import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Board } from './Board';
import type { TileData } from '../../hooks/gameLogic';

const makeTile = (id: number, value: number, row: number, col: number): TileData => ({
  id, value, row, col, isNew: false, isMerged: false,
});

describe('Board', () => {
  it('renders 16 empty background cells', () => {
    const { container } = render(
      <Board tiles={[]} isOver={false} onRestart={jest.fn()} />
    );
    expect(container.querySelectorAll('[class*="emptyCell"]')).toHaveLength(16);
  });

  it('renders tile values', () => {
    const tiles = [makeTile(1, 2, 0, 0), makeTile(2, 512, 2, 3)];
    render(<Board tiles={tiles} isOver={false} onRestart={jest.fn()} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('512')).toBeInTheDocument();
  });

  it('hides game-over overlay when isOver=false', () => {
    render(<Board tiles={[]} isOver={false} onRestart={jest.fn()} />);
    expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
  });

  it('shows game-over overlay when isOver=true', () => {
    render(<Board tiles={[]} isOver={true} onRestart={jest.fn()} />);
    expect(screen.getByText('Game Over')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls onRestart when Try Again is clicked', () => {
    const onRestart = jest.fn();
    render(<Board tiles={[]} isOver={true} onRestart={onRestart} />);
    userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
