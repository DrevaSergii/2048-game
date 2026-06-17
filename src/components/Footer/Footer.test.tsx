import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders undo button', () => {
    render(<Footer onUndo={jest.fn()} canUndo={true} />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
  });

  it('undo button is enabled when canUndo=true', () => {
    render(<Footer onUndo={jest.fn()} canUndo={true} />);
    expect(screen.getByRole('button', { name: /undo/i })).not.toBeDisabled();
  });

  it('undo button is disabled when canUndo=false', () => {
    render(<Footer onUndo={jest.fn()} canUndo={false} />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
  });

  it('calls onUndo when undo button is clicked', () => {
    const onUndo = jest.fn();
    render(<Footer onUndo={onUndo} canUndo={true} />);
    userEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('does not call onUndo when button is disabled', () => {
    const onUndo = jest.fn();
    render(<Footer onUndo={onUndo} canUndo={false} />);
    userEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(onUndo).not.toHaveBeenCalled();
  });

  it('renders copyright text', () => {
    render(<Footer onUndo={jest.fn()} canUndo={false} />);
    expect(screen.getByText(/bluedot/i)).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});
