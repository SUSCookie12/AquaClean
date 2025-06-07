
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center px-4 animate-in fade-in-0 slide-in-from-bottom-8 duration-500">
      <AlertTriangle className="w-24 h-24 text-destructive mb-6" />
      <h1 className="text-5xl font-bold font-headline mb-4">{t('pageNotFound')}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        {/* Add a more descriptive message if needed */}
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link href="/">{t('goHome')}</Link>
      </Button>
    </div>
  );
}
