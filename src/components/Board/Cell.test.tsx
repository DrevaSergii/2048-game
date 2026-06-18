import { render, screen } from '@testing-library/react';
import { Cell } from './Cell';
import type { TileData } from '../../hooks/gameLogic';

const makeTile = (value: number, overrides: Partial<TileData> = {}): TileData => ({
  id: 1, value, row: 0, col: 0, isNew: false, isMerged: false, ...overrides,
});

describe('Cell', () => {
  it('renders tile value as text', () => {
    render(<Cell tile={makeTile(2)} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it.each([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048])(
    'renders tile value %i',
    (value) => {
      const { container } = render(<Cell tile={makeTile(value)} />);
      expect(container.textContent).toBe(String(value));
    }
  );

  it('renders a span child', () => {
    const { container } = render(<Cell tile={makeTile(2)} />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('applies appear animation when isNew=true', () => {
    const { container } = render(<Cell tile={makeTile(2, { isNew: true })} />);
    expect(container.querySelector('[class*="appear"]')).toBeInTheDocument();
  });

  it('applies merge animation when isMerged=true', () => {
    const { container } = render(<Cell tile={makeTile(4, { isMerged: true })} />);
    expect(container.querySelector('[class*="merge"]')).toBeInTheDocument();
  });

  it('sets translate transform based on row and col', () => {
    const { container } = render(<Cell tile={makeTile(2, { row: 2, col: 3 })} />);
    const wrapper = container.firstChild as HTMLElement;
    // col=3 → 3*114=342px, row=2 → 2*114=228px
    expect(wrapper.style.transform).toBe('translate(342px, 228px)');
  });

  it('does not apply appear or merge class by default', () => {
    const { container } = render(<Cell tile={makeTile(2)} />);
    expect(container.querySelector('[class*="appear"]')).not.toBeInTheDocument();
    expect(container.querySelector('[class*="merge"]')).not.toBeInTheDocument();
  });
});
