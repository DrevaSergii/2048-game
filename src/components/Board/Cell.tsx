import { FC } from 'react';
import { TILE_STYLES, UNKNOWN_TILE_STYLE } from '../../constants';
import styles from './Cell.module.scss';

export type CellProps = {
  value: number;
};

export const Cell: FC<CellProps> = ({ value }) => {
  if (value === 0) {
    return <div className={`${styles.cell} ${styles.empty}`} />;
  }

  const { gradient, color, fontSize } = TILE_STYLES[value] ?? UNKNOWN_TILE_STYLE;

  return (
    <div className={styles.cell} style={{ backgroundImage: gradient }}>
      <span style={{ color, fontSize }}>{value}</span>
    </div>
  );
};
