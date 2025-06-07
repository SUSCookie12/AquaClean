
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Package, BarChart3, Activity } from 'lucide-react';

interface OverviewStats {
  totalUsers: number;
  totalProducts: number;
}

export default function AdminOverview() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const productsSnapshot = await getDocs(collection(db, 'products'));
        setStats({
          totalUsers: usersSnapshot.size,
          totalProducts: productsSnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching overview stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6 animate-pulse">
        {[1,2,3,4].map(i => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                </CardContent>
            </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-destructive">{t('errorLoadingStats')}</p>;
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('totalUsers')}</CardTitle>
          <Users className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">{t('registeredUsersCount')}</p>
        </CardContent>
      </Card>
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('totalProducts')}</CardTitle>
          <Package className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">{t('productsInCatalog')}</p>
        </CardContent>
      </Card>
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('siteActivity')}</CardTitle>
          <Activity className="h-5 w-5 text-destructive" />
        </CardHeader>
        <CardContent>
          {/* Placeholder for future charts or activity logs */}
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">{t('moreStatsComingSoon')}</p>
            <p className="text-xs text-muted-foreground">{t('moreStatsComingSoonDesc')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
