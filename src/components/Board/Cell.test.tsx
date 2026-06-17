import { render, screen } from '@testing-library/react';
import { Cell } from './Cell';

describe('Cell', () => {
  it('renders empty div without text for value 0', () => {
    const { container } = render(<Cell value={0} />);
    expect(container.firstChild).toHaveClass('empty');
    expect(container.textContent).toBe('');
  });

  it('renders the tile value as text', () => {
    render(<Cell value={2} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not add empty class for non-zero value', () => {
    const { container } = render(<Cell value={4} />);
    expect(container.firstChild).not.toHaveClass('empty');
  });

  it.each([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048])(
    'renders tile value %i',
    (value) => {
      const { container } = render(<Cell value={value} />);
      expect(container.textContent).toBe(String(value));
    }
  );

  it('renders a span child for non-zero tiles', () => {
    const { container } = render(<Cell value={2} />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('does not render a span child for empty cell', () => {
    const { container } = render(<Cell value={0} />);
    expect(container.querySelector('span')).not.toBeInTheDocument();
  });
});
