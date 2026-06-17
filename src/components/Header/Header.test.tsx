import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';

describe('Header', () => {
  it('displays current score', () => {
    render(<Header score={1234} best={0} onNewGame={jest.fn()} />);
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('displays best score', () => {
    render(<Header score={0} best={9999} onNewGame={jest.fn()} />);
    expect(screen.getByText('9999')).toBeInTheDocument();
  });

  it('shows Score and Best labels', () => {
    render(<Header score={0} best={0} onNewGame={jest.fn()} />);
    expect(screen.getByText(/score/i)).toBeInTheDocument();
    expect(screen.getByText(/best/i)).toBeInTheDocument();
  });

  it('renders New Game button', () => {
    render(<Header score={0} best={0} onNewGame={jest.fn()} />);
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument();
  });

  it('calls onNewGame when New Game is clicked', () => {
    const onNewGame = jest.fn();
    render(<Header score={0} best={0} onNewGame={onNewGame} />);
    userEvent.click(screen.getByRole('button', { name: /new game/i }));
    expect(onNewGame).toHaveBeenCalledTimes(1);
  });

  it('updates displayed score and best when props change', () => {
    const { rerender } = render(<Header score={0} best={0} onNewGame={jest.fn()} />);
    expect(screen.getAllByText('0')).toHaveLength(2);
    rerender(<Header score={256} best={256} onNewGame={jest.fn()} />);
    expect(screen.getAllByText('256')).toHaveLength(2);
  });
});
