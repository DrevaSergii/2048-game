import { FC } from 'react';
import { Cell } from './Cell';
import styles from './Board.module.scss';

type BoardProps = {
  grid: number[][];
  over: boolean;
  onRestart: () => void;
};

export const Board: FC<BoardProps> = ({ grid, over, onRestart }) => {
  return (
    <div className={styles.board}>
      <div className={styles.grid}>
        {grid.flat().map((value, i) => (
          <Cell key={i} value={value} />
        ))}
      </div>
      {over && (
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
