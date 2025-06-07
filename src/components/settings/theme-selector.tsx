
'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Sun, Moon, Laptop } from 'lucide-react'; // Removed Palette icon
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const themes = [
    { name: t('light'), value: 'light', icon: <Sun className="mr-2 h-5 w-5" /> },
    { name: t('dark'), value: 'dark', icon: <Moon className="mr-2 h-5 w-5" /> },
    { name: t('system'), value: 'system', icon: <Laptop className="mr-2 h-5 w-5" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('theme')}</CardTitle>
        <CardDescription>Select your preferred application theme.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((item) => (
          <Button
            key={item.value}
            variant={theme === item.value ? 'default' : 'outline'}
            onClick={() => setTheme(item.value)}
            className="w-full justify-start py-6 text-base"
          >
            {item.icon}
            {item.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
