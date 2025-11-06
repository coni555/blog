export type Stone = 'B' | 'W' | null;
export type Board = Stone[][];

export interface MoveEvaluation {
  score: number;
  reasons: string[];
  captures: number;
  selfLiberties: number;
}

export interface SuggestedMove extends MoveEvaluation {
  x: number;
  y: number;
}

export const BOARD_SIZE = 19;

export function createEmptyBoard(size: number = BOARD_SIZE): Board {
  return Array.from({ length: size }, () => Array<Stone>(size).fill(null));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function getNeighbors(x: number, y: number, size: number = BOARD_SIZE) {
  const deltas = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  return deltas
    .map(([dx, dy]) => [x + dx, y + dy] as const)
    .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size);
}

export function collectGroup(board: Board, x: number, y: number) {
  const color = board[y][x];
  if (!color) return { stones: [], liberties: 0 };
  const visited = new Set<string>();
  const stack: Array<[number, number]> = [[x, y]];
  const stones: Array<[number, number]> = [];
  let liberties = 0;

  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    const key = `${cx},${cy}`;
    if (visited.has(key)) continue;
    visited.add(key);
    stones.push([cx, cy]);

    for (const [nx, ny] of getNeighbors(cx, cy, board.length)) {
      const neighbor = board[ny][nx];
      if (!neighbor) {
        liberties += 1;
      } else if (neighbor === color) {
        const neighborKey = `${nx},${ny}`;
        if (!visited.has(neighborKey)) {
          stack.push([nx, ny]);
        }
      }
    }
  }

  return { stones, liberties };
}

export function removeGroup(board: Board, group: Array<[number, number]>) {
  for (const [x, y] of group) {
    board[y][x] = null;
  }
}

export function applyMove(board: Board, x: number, y: number, color: Stone): {
  nextBoard: Board;
  captures: number;
  selfLiberties: number;
  legal: boolean;
} {
  if (color === null) {
    return { nextBoard: board, captures: 0, selfLiberties: 0, legal: false };
  }

  if (board[y][x]) {
    return { nextBoard: board, captures: 0, selfLiberties: 0, legal: false };
  }

  const nextBoard = cloneBoard(board);
  nextBoard[y][x] = color;
  let captures = 0;

  const opponent: Stone = color === 'B' ? 'W' : 'B';

  for (const [nx, ny] of getNeighbors(x, y, board.length)) {
    if (nextBoard[ny][nx] === opponent) {
      const { stones, liberties } = collectGroup(nextBoard, nx, ny);
      if (liberties === 0) {
        captures += stones.length;
        removeGroup(nextBoard, stones);
      }
    }
  }

  const { liberties } = collectGroup(nextBoard, x, y);
  if (liberties === 0) {
    return { nextBoard: board, captures: 0, selfLiberties: 0, legal: false };
  }

  return { nextBoard, captures, selfLiberties: liberties };
}

export function evaluateMove(
  board: Board,
  x: number,
  y: number,
  color: Stone,
  moveNumber: number
): MoveEvaluation {
  const { nextBoard, captures, selfLiberties, legal } = applyMove(board, x, y, color);

  if (!legal) {
    return {
      score: -999,
      reasons: ['该手不合法，会导致自提或重复局面。'],
      captures: 0,
      selfLiberties: 0,
    };
  }

  const reasons: string[] = [];
  let score = 0;

  if (captures > 0) {
    score += captures * 8;
    reasons.push(`吃掉了 ${captures} 枚对方棋子`);
  }

  if (selfLiberties <= 1) {
    score -= 6;
    reasons.push('形成了自我打吃，后续非常危险');
  } else if (selfLiberties <= 2) {
    score -= 2;
    reasons.push('新形成的棋形气比较紧，注意连络');
  } else {
    score += 2;
  }

  const center = (board.length - 1) / 2;
  const distanceToCenter = Math.abs(x - center) + Math.abs(y - center);
  score += Math.max(0, 6 - distanceToCenter);
  if (distanceToCenter >= 10) {
    reasons.push('落子偏向边角，序盘更应注意大模样');
  }

  if (moveNumber < 40 && (x === 0 || y === 0 || x === board.length - 1 || y === board.length - 1)) {
    score -= 4;
    reasons.push('序盘在一线落子通常效率较低');
  }

  if (captures === 0 && selfLiberties <= 2) {
    const opponent = color === 'B' ? 'W' : 'B';
    let neighborSupport = 0;
    for (const [nx, ny] of getNeighbors(x, y, board.length)) {
      if (nextBoard[ny][nx] === color) neighborSupport += 1;
      if (nextBoard[ny][nx] === opponent) neighborSupport -= 0.5;
    }
    if (neighborSupport <= 0) {
      score -= 4;
      reasons.push('周围支援不够，容易被对手强攻');
    }
  }

  return { score, reasons, captures, selfLiberties };
}

export function findBestMove(
  board: Board,
  color: Stone,
  moveNumber: number
): SuggestedMove | null {
  let best: SuggestedMove | null = null;

  for (let y = 0; y < board.length; y += 1) {
    for (let x = 0; x < board.length; x += 1) {
      if (board[y][x] !== null) continue;
      const evalResult = evaluateMove(board, x, y, color, moveNumber);
      if (evalResult.score <= -999) continue;
      const candidate: SuggestedMove = {
        x,
        y,
        ...evalResult,
      };
      if (!best || candidate.score > best.score) {
        best = candidate;
      }
    }
  }

  return best;
}

export function formatCoordinates(x: number, y: number) {
  const columnLetters = 'ABCDEFGHJKLMNOPQRST'.split('');
  return `${columnLetters[x] ?? x + 1}${BOARD_SIZE - y}`;
}

