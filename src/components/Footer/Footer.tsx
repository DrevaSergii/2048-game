import { FC } from 'react';
import styles from './Footer.module.scss';

type FooterProps = {
  onUndo: () => void;
  canUndo: boolean;
};

export const Footer: FC<FooterProps> = ({ onUndo, canUndo }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.undoWrapper}>
        <button
          className={styles.undoButton}
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo last move"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
            <path
              d="M11 8L5 14L11 20"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 14H20C23.866 14 27 17.134 27 21C27 24.866 23.866 28 20 28H13"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p className={styles.copyright}>© 2026 Bluedot. All rights reserved.</p>
    </footer>
  );
};
