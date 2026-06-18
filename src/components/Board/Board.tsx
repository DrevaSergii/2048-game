import { FC } from 'react';
import { Cell } from './Cell';
import styles from './Board.module.scss';

type BoardProps = {
  grid: number[][];
  isOver: boolean;
  onRestart: () => void;
};

export const Board: FC<BoardProps> = ({ grid, isOver, onRestart }) => {
  return (
    <div className={styles.board}>
      <div className={styles.grid}>
        {grid.flatMap((row, r) =>
          row.map((value, c) => (
            <Cell key={`${r}-${c}`} value={value} />
          ))
        )}
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
