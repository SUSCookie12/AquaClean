
'use client';

import AddProductForm from '@/components/admin/add-product-form';
import UserManagementTable from '@/components/admin/user-management-table';
import PopularProductsManager from '@/components/admin/popular-products-manager';
import AdminOverview from '@/components/admin/admin-overview';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, LayoutDashboard, Users, ShoppingBag, Settings2, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (!loading && user && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-10 w-full mb-4" /> {/* TabsList skeleton */}
        <Skeleton className="h-96 w-full" /> {/* Tab content skeleton */}
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Alert variant="destructive" className="max-w-md animate-in fade-in duration-300">
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold flex items-center">
          <LayoutDashboard className="mr-3 h-8 w-8 text-primary" />
          {t('admin')}
        </h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-6 h-auto sm:h-10">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" /> {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" /> {t('userManagement')}
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" /> {t('productManagement')}
          </TabsTrigger>
          <TabsTrigger value="homepageSettings" className="flex items-center gap-2 py-2.5 text-xs sm:text-sm">
            <Settings2 className="h-4 w-4 sm:h-5 sm:w-5" /> {t('homepageSettings')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-in fade-in-50 duration-500">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-headline">{t('overview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminOverview />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="animate-in fade-in-50 duration-500 delay-100">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-headline">{t('userManagement')}</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagementTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="animate-in fade-in-50 duration-500 delay-200">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-headline">{t('addProduct')}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddProductForm />
            </CardContent>
          </Card>
          {/* Future: Add Product Listing and Edit/Delete functionalities here */}
        </TabsContent>
        
        <TabsContent value="homepageSettings" className="animate-in fade-in-50 duration-500 delay-300">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-headline">{t('managePopularProducts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <PopularProductsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
