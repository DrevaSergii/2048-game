import { FC } from 'react';
import { TileData } from '../../hooks/gameLogic';
import { TILE_STYLES, UNKNOWN_TILE_STYLE } from '../../constants';
import styles from './Cell.module.scss';

const TILE_STEP = 114; // 110px tile + 4px gap

type CellProps = {
  tile: TileData;
};

export const Cell: FC<CellProps> = ({ tile }) => {
  const { gradient, color, fontSize } = TILE_STYLES[tile.value] ?? UNKNOWN_TILE_STYLE;

  const tx = tile.col * TILE_STEP;
  const ty = tile.row * TILE_STEP;

  return (
    <div
      className={`${styles.cellWrapper}${tile.isMerged ? ` ${styles.mergedWrapper}` : ''}`}
      style={{ transform: `translate(${tx}px, ${ty}px)` }}
    >
      <div
        className={`${styles.cell}${tile.isNew ? ` ${styles.appear}` : ''}${tile.isMerged ? ` ${styles.merge}` : ''}`}
        style={{ backgroundImage: gradient }}
      >
        <span style={{ color, fontSize }}>{tile.value}</span>
      </div>
    </div>
  );
};
