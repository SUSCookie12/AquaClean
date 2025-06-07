
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, UserCircle, Mail, Hash, ShieldCheck, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AccountPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Redirect to home if not logged in
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container mx-auto max-w-2xl py-10 px-4">
        <div className="space-y-8 animate-pulse">
          <Skeleton className="h-10 w-1/3" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full" />
                <div className="space-y-3 flex-grow">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full sm:w-32" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const userRoles = [];
  if (user.roles?.admin) userRoles.push({ label: t('roleAdmin'), Icon: ShieldCheck, variant: 'destructive' as const });
  if (user.roles?.clean) userRoles.push({ label: t('roleClean'), Icon: UserCog, variant: 'secondary' as const });
  if (userRoles.length === 0) userRoles.push({ label: t('roleUser'), Icon: UserCircle, variant: 'outline' as const });


  return (
    <div className="container mx-auto max-w-2xl py-10 px-4 animate-in fade-in duration-500">
      <h1 className="text-3xl sm:text-4xl font-headline font-semibold mb-8 text-primary">
        {t('accountProfileTitle')}
      </h1>
      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="text-center sm:text-left">
          <CardTitle className="text-2xl sm:text-3xl font-semibold">
            {user.displayName || t('noName')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('accountProfileDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-4 sm:p-0">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 text-6xl border-4 border-primary/20 shadow-lg">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>
                {user.displayName ? (
                  user.displayName.charAt(0).toUpperCase()
                ) : (
                  <UserCircle className="h-full w-full" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-3 text-center sm:text-left">
              <div className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{t('emailLabel')}:</span>
                <span>{user.email || t('notAvailable')}</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{t('uidLabel')}:</span>
                <span className="text-sm break-all">{user.uid}</span>
              </div>
              <div className="flex items-center gap-2 text-lg pt-1">
                <span className="font-medium">{t('rolesLabel')}:</span>
                 <div className="flex flex-wrap gap-2">
                    {userRoles.map(role => (
                        <Badge key={role.label} variant={role.variant} className="text-sm py-1 px-3">
                            <role.Icon className="mr-1.5 h-4 w-4" />
                            {role.label}
                        </Badge>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button variant="destructive" onClick={signOut} className="w-full sm:w-auto text-base py-3">
            <LogOut className="mr-2 h-5 w-5" />
            {t('logout')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
