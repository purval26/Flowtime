'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="bg-surface border border-border shadow-sm rounded-card p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-danger">Access Denied</h1>
            <p className="text-sm text-text-secondary">
              Your account does not have permission to access the Flowtime Admin Panel.
            </p>
          </div>
          <p className="text-xs text-text-muted">
            Only designated owners, administrators, or editors can edit schedules.
          </p>
          <div>
            <button
              onClick={handleSignOut}
              className="inline-flex w-full justify-center rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-accent/90 transition-colors"
            >
              Sign Out & Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
