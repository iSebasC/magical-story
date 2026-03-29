import { Suspense } from 'react';
import AuthForm from './AuthForm';

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-inkm">Loading...</p>
        </div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
