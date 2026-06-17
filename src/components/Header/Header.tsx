import { FC } from 'react';
import styles from './Header.module.scss';

type HeaderProps = {
  score: number;
  best: number;
  onNewGame: () => void;
};

export const Header: FC<HeaderProps> = ({ score, best, onNewGame }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoSub}>bluedot</span>
        <span className={styles.logoMain}>2048</span>
      </div>

      <div className={styles.scores}>
        <div className={styles.scoreBox}>
          <span className={styles.scoreLabel}>Score</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>
        <div className={`${styles.scoreBox} ${styles.bestBox}`}>
          <span className={styles.scoreLabel}>Best</span>
          <span className={styles.scoreValue}>{best}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.newGame} onClick={onNewGame}>
          New Game
        </button>
      </div>
    </header>
  );
};
