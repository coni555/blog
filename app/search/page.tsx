import { Suspense } from 'react';
import ClientSearchPage from './client-page';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
      <ClientSearchPage />
    </Suspense>
  );
} 