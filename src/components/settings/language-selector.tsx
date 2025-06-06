'use client';

import { useLanguage } from '@/hooks/use-language';
import { LANGUAGES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Card>
        <CardHeader>
            <CardTitle>{t('language')}</CardTitle>
            <CardDescription>Choose your preferred language for the application.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LANGUAGES.map((lang) => (
            <Button
                key={lang.code}
                variant={language === lang.code ? 'default' : 'outline'}
                onClick={() => setLanguage(lang.code)}
                className="w-full justify-start py-6 text-base"
            >
                {lang.name}
                {language === lang.code && <Check className="ml-auto h-5 w-5" />}
            </Button>
            ))}
        </CardContent>
    </Card>
  );
}
