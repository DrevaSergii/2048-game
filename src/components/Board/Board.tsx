import { FC } from 'react';
import { TileData } from '../../hooks/gameLogic';
import { Cell } from './Cell';
import styles from './Board.module.scss';

type BoardProps = {
  tiles: TileData[];
  isOver: boolean;
  onRestart: () => void;
};

export const Board: FC<BoardProps> = ({ tiles, isOver, onRestart }) => {
  return (
    <div className={styles.board}>
      <div className={styles.grid}>
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className={styles.emptyCell} />
        ))}
      </div>
      <div className={styles.tileLayer}>
        {tiles.map(tile => (
          <Cell key={tile.id} tile={tile} />
        ))}
      </div>
      {isOver && (
        <div className={styles.overlay}>
          <p className={styles.overlayTitle}>Game Over</p>
          <button className={styles.overlayButton} onClick={onRestart}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
