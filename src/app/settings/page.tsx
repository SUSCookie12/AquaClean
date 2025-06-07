
'use client';

import ThemeSelector from '@/components/settings/theme-selector';
import LanguageSelector from '@/components/settings/language-selector';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


export default function SettingsPage() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Redirect if not logged in
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-8 duration-500">
      <h1 className="text-3xl font-headline font-semibold">{t('appSettings')}</h1>
      <ThemeSelector />
      <LanguageSelector />
    </div>
  );
}
