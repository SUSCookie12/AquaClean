
'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AppUser, Roles } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ShieldCheck, UserCog, UserX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const USERS_PER_PAGE = 10;

export default function UserManagementTable() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  const fetchUsers = useCallback(async (loadMore = false, currentSearchTerm = searchTerm) => {
    if (!loadMore) {
      setLoading(true);
      setUsers([]);
      setLastVisible(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      let q = query(collection(db, 'users'), orderBy('email', 'asc'), limit(USERS_PER_PAGE));

      if (loadMore && lastVisible) {
        q = query(collection(db, 'users'), orderBy('email', 'asc'), startAfter(lastVisible), limit(USERS_PER_PAGE));
      }
      
      // Basic client-side filtering if search term exists.
      // For large datasets, server-side search (e.g., with Algolia or Firestore extensions) is better.
      // This implementation fetches then filters, which is not ideal for > thousands of users.
      const usersSnapshot = await getDocs(q);
      let usersList = usersSnapshot.docs.map(docSnap => ({
        uid: docSnap.id,
        ...docSnap.data(),
      } as AppUser));

      if (currentSearchTerm) {
        usersList = usersList.filter(user => 
            (user.email && user.email.toLowerCase().includes(currentSearchTerm.toLowerCase())) ||
            (user.displayName && user.displayName.toLowerCase().includes(currentSearchTerm.toLowerCase()))
        );
      }
      
      setUsers(prevUsers => loadMore ? [...prevUsers, ...usersList] : usersList);
      
      const newLastVisible = usersSnapshot.docs[usersSnapshot.docs.length - 1];
      setLastVisible(newLastVisible || null);
      setHasMore(usersSnapshot.docs.length === USERS_PER_PAGE && !!newLastVisible);

    } catch (err) {
      console.error("Error fetching users:", err);
      setError(t('errorFetchingUsers'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [t, searchTerm, lastVisible]); // Added searchTerm and lastVisible as dependencies

  useEffect(() => {
    fetchUsers(false, searchTerm); // Initial fetch, or refetch on search term change
  }, [searchTerm]); // Removed fetchUsers from here to avoid loop, it's called inside

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Debounce or fetch on submit might be better for performance.
    // For now, it refetches in useEffect.
  };
  
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchUsers(true, searchTerm);
    }
  };


  const handleRoleChange = async (userId: string, roleName: keyof Roles, value: boolean) => {
    const originalUsers = [...users];
    try {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.uid === userId
            ? { ...user, roles: { ...user.roles, [roleName]: value } }
            : user
        )
      );

      const userDocRef = doc(db, 'users', userId);
      const updatePath = `roles.${roleName}`;
      await updateDoc(userDocRef, {
        [updatePath]: value,
      });

      toast({
        title: t('roleUpdatedSuccess'),
        description: `${t(roleName as string)} ${t('roleFor')} user ${userId.substring(0,8)}... ${t('roleUpdatedTo')} ${value ? t('active') : t('inactive')}.`,
      });
    } catch (err) {
      console.error("Error updating role:", err);
      setUsers(originalUsers); // Revert optimistic update on error
      toast({
        title: t('roleUpdatedError'),
        description: t('errorUpdatingRoleDesc'),
        variant: 'destructive',
      });
    }
  };
  
  if (loading && users.length === 0 && !loadingMore) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full mb-4" /> {/* Search input skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-3 border-b">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-grow">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-12 sm:w-16" />
            <Skeleton className="h-6 w-12 sm:w-16" />
            <Skeleton className="h-6 w-16 sm:w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('error')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 p-1 sm:p-4">
        <Input 
            type="search"
            placeholder={t('searchUsersPlaceholder') || "Search users by name or email..."}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full max-w-sm mb-4"
        />
        <Alert variant="default" className="mb-4 bg-primary/10 border-primary/30">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">{t('adminCautionTitle') || "Admin Caution"}</AlertTitle>
            <AlertDescription>
            {t('userRoleChangeWarning')}
            </AlertDescription>
        </Alert>
        <div className="overflow-x-auto rounded-md border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="w-[200px] sm:w-[250px]">{t('user')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead className="text-center">{t('roleAdmin')}</TableHead>
                <TableHead className="text-center">{t('roleClean')}</TableHead>
                <TableHead className="text-center min-w-[120px]">{t('currentRoles')}</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {users.map((user) => (
                <TableRow key={user.uid} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                    <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                        <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium text-sm sm:text-base">{user.displayName || <span className="italic text-muted-foreground">{t('noName')}</span>}</div>
                        <div className="text-xs text-muted-foreground hidden sm:block">UID: {user.uid.substring(0,12)}...</div>
                    </div>
                    </div>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">{user.email}</TableCell>
                <TableCell className="text-center">
                    <Switch
                    checked={!!user.roles?.admin}
                    onCheckedChange={(value) => handleRoleChange(user.uid, 'admin', value)}
                    aria-label={`Toggle admin role for ${user.displayName || user.email}`}
                    className="data-[state=checked]:bg-destructive data-[state=unchecked]:bg-muted-foreground/30"
                    />
                </TableCell>
                <TableCell className="text-center">
                    <Switch
                    checked={!!user.roles?.clean}
                    onCheckedChange={(value) => handleRoleChange(user.uid, 'clean', value)}
                    aria-label={`Toggle clean role for ${user.displayName || user.email}`}
                    className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted-foreground/30"
                    />
                </TableCell>
                <TableCell className="text-center">
                    <div className="flex flex-wrap gap-1 justify-center items-center">
                    {user.roles?.admin && <Badge variant="destructive" className="text-xs"><ShieldCheck className="mr-1 h-3 w-3"/>{t('admin')}</Badge>}
                    {user.roles?.clean && <Badge variant="secondary" className="text-xs"><UserCog className="mr-1 h-3 w-3"/>{t('clean')}</Badge>}
                    {(!user.roles || Object.values(user.roles).every(r => !r)) && <Badge variant="outline" className="text-xs"><UserX className="mr-1 h-3 w-3"/>{t('roleUser')}</Badge>}
                    </div>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
        {users.length === 0 && !loading && !loadingMore && (
             <div className="text-center py-10 text-muted-foreground">
                <p>{searchTerm ? t('noUsersFoundSearch') : t('noUsersInSystem')}</p>
            </div>
        )}
        {hasMore && !loadingMore && users.length > 0 && (
          <div className="text-center mt-6">
            <Button onClick={handleLoadMore} variant="outline">
              {t('loadMoreUsers') || "Load More"}
            </Button>
          </div>
        )}
        {loadingMore && (
          <div className="text-center mt-6 text-muted-foreground">
            {t('loading')}
          </div>
        )}
    </div>
  );
}

