import { useGame, useTouchGestures } from './hooks';
import { Header, Board, Footer } from './components';
import styles from './App.module.scss';

function App() {
  const { tiles, score, best, isOver, canUndo, move, reset, undo } = useGame();
  const { onTouchStart, onTouchEnd } = useTouchGestures(move);

  return (
    <div className={styles.app} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Header score={score} best={best} onNewGame={reset} />
      <main className={styles.main}>
        <Board tiles={tiles} isOver={isOver} onRestart={reset} />
      </main>
      <Footer onUndo={undo} canUndo={canUndo} />
    </div>
  );
}

export default App;
