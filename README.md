# 2048

A classic 2048 puzzle game built with React and TypeScript.

**Live demo:** https://DrevaSergii.github.io/2048-game

## How to play

Combine tiles of the same number to reach **2048**.

| Input | Action |
|-------|--------|
| Arrow keys | Move tiles |

Tiles with equal values merge when they collide. Each merge adds their sum to your score. The game ends when no moves are left.

## Tech stack

- React 19 + TypeScript
- SCSS modules
- Custom hooks for game logic and touch gestures
- Tests with React Testing Library

## Local development

```bash
npm install
npm start        # http://localhost:3000
npm test         # run tests
```

## Deploy

```bash
npm run deploy   # builds and pushes to GitHub Pages
```
