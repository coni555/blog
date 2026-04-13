'use client';

import { useMemo, useState } from 'react';
import {
  applyMove,
  BOARD_SIZE,
  createEmptyBoard,
  evaluateMove,
  findBestMove,
  formatCoordinates,
  type Board,
  type Stone,
} from './goEngine';

type ChatMessage = {
  role: 'coach' | 'player';
  text: string;
};

type PlayerColor = 'B' | 'W';

const stoneColors: Record<Exclude<Stone, null>, string> = {
  B: 'bg-black',
  W: 'bg-white',
};

function translateColor(color: Stone) {
  if (color === 'B') return '黑棋';
  if (color === 'W') return '白棋';
  return '空';
}

function moveLabel(moveNumber: number) {
  return `第 ${moveNumber} 手`;
}

export default function GoGame() {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [playerColor, setPlayerColor] = useState<PlayerColor>('B');
  const [turn, setTurn] = useState<Stone>('B');
  const [moveNumber, setMoveNumber] = useState(1);
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: 'coach',
      text: '欢迎来到在线围棋！你执黑先行，我会在关键时刻给出建议。',
    },
  ]);
  const [lastMove, setLastMove] = useState<{ x: number; y: number; color: Stone } | null>(null);

  const bestForPlayer = useMemo(() => findBestMove(board, playerColor, moveNumber), [
    board,
    playerColor,
    moveNumber,
  ]);

  const bestForOpponent = useMemo(() => {
    const opponent: Stone = playerColor === 'B' ? 'W' : 'B';
    return findBestMove(board, opponent, moveNumber);
  }, [board, playerColor, moveNumber]);

  function resetGame() {
    setBoard(createEmptyBoard());
    setTurn('B');
    setMoveNumber(1);
    setChat([
      {
        role: 'coach',
        text: '新的对局开始了，加油！记得保持冷静，关注整体形势。',
      },
    ]);
    setLastMove(null);
  }

  function appendChat(message: ChatMessage) {
    setChat((prev) => [...prev, message]);
  }

  function handlePlayerMove(x: number, y: number) {
    if (turn !== playerColor) return;
    const playerMoveNumber = moveNumber;
    const result = applyMove(board, x, y, playerColor);
    if (!result.legal) {
      appendChat({
        role: 'coach',
        text: '这个位置不太行，会造成自杀或者违反规则，换个地方试试吧。',
      });
      return;
    }

    const moveText = `${translateColor(playerColor)} ${moveLabel(playerMoveNumber)}：${formatCoordinates(x, y)}`;

    setBoard(result.nextBoard);
    setTurn(playerColor === 'B' ? 'W' : 'B');
    setMoveNumber((prev) => prev + 1);
    setLastMove({ x, y, color: playerColor });
    appendChat({ role: 'player', text: moveText });

    const evaluation = evaluateMove(board, x, y, playerColor, playerMoveNumber);
    if (evaluation.score < 8) {
      const suggestions: string[] = [];
      if (evaluation.reasons.length) {
        suggestions.push(...evaluation.reasons);
      }
      if (bestForPlayer && (bestForPlayer.x !== x || bestForPlayer.y !== y)) {
        suggestions.push(
          `可以考虑下在 ${formatCoordinates(bestForPlayer.x, bestForPlayer.y)}，` +
            ` 这里会更厚实（得分 ${bestForPlayer.score.toFixed(1)}）。`
        );
      }
      if (suggestions.length) {
        appendChat({
          role: 'coach',
          text: `这一步还有更好的选择：${suggestions.join('；')}。`,
        });
      } else {
        appendChat({
          role: 'coach',
          text: '这一步还可以，但别忘了观察全局和对方潜在的要点。',
        });
      }
    } else {
      appendChat({
        role: 'coach',
        text: '好棋！继续保持节奏，注意寻找对方弱点。',
      });
    }

    const aiColor: Stone = playerColor === 'B' ? 'W' : 'B';
    setTimeout(() => {
      makeAIMove(result.nextBoard, aiColor, playerMoveNumber + 1);
    }, 450);
  }

  function makeAIMove(currentBoard: Board, aiColor: Stone, aiMoveNumber: number) {
    const bestMove = findBestMove(currentBoard, aiColor, aiMoveNumber);
    if (!bestMove) {
      appendChat({ role: 'coach', text: '棋盘已满或没有合适的点了，我们可以重新来一局。' });
      return;
    }

    const result = applyMove(currentBoard, bestMove.x, bestMove.y, aiColor);
    if (!result.legal) return;

    const moveText = `${translateColor(aiColor)} ${moveLabel(aiMoveNumber)}：${formatCoordinates(
      bestMove.x,
      bestMove.y
    )}`;

    setBoard(result.nextBoard);
    setTurn(playerColor);
    setMoveNumber(aiMoveNumber + 1);
    setLastMove({ x: bestMove.x, y: bestMove.y, color: aiColor });
    appendChat({ role: 'coach', text: `我下在了 ${formatCoordinates(bestMove.x, bestMove.y)}，试着应对一下吧。` });
    appendChat({ role: 'player', text: moveText });
  }

  function handleIntersectionClick(x: number, y: number) {
    if (turn !== playerColor) return;
    handlePlayerMove(x, y);
  }

  function renderIntersection(x: number, y: number) {
    const stone = board[y][x];
    const isLast = lastMove && lastMove.x === x && lastMove.y === y;
    const baseClasses = 'relative flex items-center justify-center h-8 w-8 border border-yellow-900';

    return (
      <button
        key={`${x}-${y}`}
        type="button"
        onClick={() => handleIntersectionClick(x, y)}
        className={`${baseClasses} ${stone ? '' : 'hover:bg-yellow-200/40'}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-full bg-yellow-900" />
          <div className="absolute h-full w-px bg-yellow-900" />
        </div>
        {stone && (
          <div
            className={`h-6 w-6 rounded-full shadow-inner ${stoneColors[stone]} ${
              isLast ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-yellow-200' : ''
            }`}
          />
        )}
      </button>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:flex-row">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-neutral-600">我方执：</label>
          <select
            value={playerColor}
            onChange={(event) => {
              const nextColor = event.target.value as PlayerColor;
              setPlayerColor(nextColor);
              setTurn('B');
              setMoveNumber(1);
              setBoard(createEmptyBoard());
              setLastMove(null);
              setChat([
                {
                  role: 'coach',
                  text: `我们重新开始，这次你执${translateColor(nextColor)}先行。保持思路清晰！`,
                },
              ]);
            }}
            className="rounded border border-neutral-300 px-2 py-1 text-sm"
          >
            <option value="B">黑棋</option>
            <option value="W">白棋</option>
          </select>
          <button
            type="button"
            onClick={resetGame}
            className="rounded bg-emerald-500 px-3 py-1 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            重新开始
          </button>
        </div>
        <div className="rounded-lg bg-yellow-200/60 p-4 shadow">
          <div className="grid grid-cols-19 gap-0">{Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);
            return renderIntersection(x, y);
          })}</div>
        </div>
        <div className="text-sm text-neutral-600">
          当前轮到：{translateColor(turn)}，总手数：{moveNumber - 1}
        </div>
        <div className="text-sm text-neutral-600">
          推荐要点：
          {bestForPlayer
            ? ` ${formatCoordinates(bestForPlayer.x, bestForPlayer.y)}（估分 ${bestForPlayer.score.toFixed(1)}）`
            : ' 当前局面暂无明显要点，耐心应对。'}
        </div>
      </div>
      <div className="flex-1 rounded-lg border border-neutral-200 bg-white/80 p-4 shadow">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800">对局讲解</h2>
        <div className="flex h-[480px] flex-col gap-3 overflow-y-auto rounded border border-neutral-100 bg-neutral-50 p-3">
          {chat.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                message.role === 'coach'
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-white text-neutral-700 shadow'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm text-neutral-600">
          <p>
            * 提示来自启发式判断，帮助你理解常见手筋和布局原则。真实对局还需结合整体形势判断。
          </p>
          {bestForOpponent && (
            <p>
              * 注意对手可能瞄准 {formatCoordinates(bestForOpponent.x, bestForOpponent.y)}，提前考虑防守方案。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

