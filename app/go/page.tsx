import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const GoGame = dynamic(() => import('../components/go/GoGame'), { ssr: false });

export const metadata: Metadata = {
  title: '在线围棋对局与指导',
  description: '与 AI 对手在线对弈围棋，并获得实时复盘建议与棋理讲解。',
};

export default function GoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-amber-100/70 to-amber-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">在线围棋练习室</h1>
          <p className="mt-3 text-base text-neutral-600">
            通过对弈与即时讲解，发现自己的薄弱环节，提升棋力。
          </p>
        </header>
        <GoGame />
      </div>
    </main>
  );
}
