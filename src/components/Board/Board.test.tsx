import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Board } from './Board';

const emptyGrid = () => Array.from({ length: 4 }, () => Array(4).fill(0));

describe('Board', () => {
  it('renders 16 cells', () => {
    const { container } = render(
      <Board grid={emptyGrid()} over={false} onRestart={jest.fn()} />
    );
    expect(container.querySelectorAll('[class*="cell"]')).toHaveLength(16);
  });

  it('renders tile values from the grid', () => {
    const grid = emptyGrid();
    grid[0][0] = 2;
    grid[2][3] = 512;
    render(<Board grid={grid} over={false} onRestart={jest.fn()} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('512')).toBeInTheDocument();
  });

  it('hides game-over overlay when over=false', () => {
    render(<Board grid={emptyGrid()} over={false} onRestart={jest.fn()} />);
    expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
  });

  it('shows game-over overlay when over=true', () => {
    render(<Board grid={emptyGrid()} over={true} onRestart={jest.fn()} />);
    expect(screen.getByText('Game Over')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls onRestart when Try Again is clicked', () => {
    const onRestart = jest.fn();
    render(<Board grid={emptyGrid()} over={true} onRestart={onRestart} />);
    userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
