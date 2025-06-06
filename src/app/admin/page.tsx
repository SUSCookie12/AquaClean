'use client';

import AddProductForm from '@/components/admin/add-product-form';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Redirect to home if not logged in
    } else if (!loading && user && !isAdmin) {
      router.push('/'); // Redirect to home if logged in but not admin
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
     // This case should ideally be handled by the redirect, but as a fallback:
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You do not have permission to view this page. Redirecting...
              </AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('addProduct')}</CardTitle>
        </CardHeader>
        <CardContent>
          <AddProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
