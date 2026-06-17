import React, {useRef, useCallback} from 'react';
import {useGame} from './hooks/useGame';
import {Header} from './components/Header/Header';
import {Board} from './components/Board/Board';
import {Footer} from './components/Footer/Footer';
import styles from './App.module.scss';

function App() {
    const {grid, score, best, over, canUndo, move, reset, undo} = useGame();
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        const t = e.touches[0];
        touchStart.current = {x: t.clientX, y: t.clientY};
    }, []);

    const onTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - touchStart.current.x;
        const dy = t.clientY - touchStart.current.y;
        touchStart.current = null;

        if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            move(dx > 0 ? 'right' : 'left');
        } else {
            move(dy > 0 ? 'down' : 'up');
        }
    }, [move]);

    return (
        <div
            className={styles.app}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <Header score={score} best={best} onNewGame={reset}/>
            <main className={styles.main}>
                <Board grid={grid} over={over} onRestart={reset}/>
            </main>
            <Footer onUndo={undo} canUndo={canUndo}/>
        </div>
    );
}

export default App;
