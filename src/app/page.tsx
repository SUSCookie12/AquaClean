
'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/product/product-card';
import ProductCardSkeleton from '@/components/product/product-card-skeleton';
import type { Product } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { Input } from '@/components/ui/input';
import { Sparkles, TrendingUp, Search, AlertTriangle } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HomePage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [recentlyAddedProducts, setRecentlyAddedProducts] = useState<Product[]>([]);
  const [mostPopularProducts, setMostPopularProducts] = useState<Product[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorRecent, setErrorRecent] = useState<string | null>(null);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      setLoadingRecent(true);
      setErrorRecent(null);
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('createdAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        const products: Product[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt as Timestamp | undefined,
          updatedAt: doc.data().updatedAt as Timestamp | undefined,
        } as Product));
        setRecentlyAddedProducts(products);
      } catch (err) {
        console.error("Error fetching recent products:", err);
        setErrorRecent(t('error'));
      } finally {
        setLoadingRecent(false);
      }
    };

    const fetchPopularProducts = async () => {
      setLoadingPopular(true);
      setErrorPopular(null);
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('title', 'asc'), limit(3)); // Placeholder for popular
        const querySnapshot = await getDocs(q);
        const products: Product[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt as Timestamp | undefined,
          updatedAt: doc.data().updatedAt as Timestamp | undefined,
        } as Product));
        setMostPopularProducts(products);
      } catch (err) {
        console.error("Error fetching popular products:", err);
        setErrorPopular(t('error'));
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchRecentProducts();
    fetchPopularProducts();
  }, [t]);

  const filterProducts = (products: Product[]) => {
    if (!searchTerm) {
      return products;
    }
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredRecentlyAdded = useMemo(() => filterProducts(recentlyAddedProducts), [searchTerm, recentlyAddedProducts]);
  const filteredMostPopular = useMemo(() => filterProducts(mostPopularProducts), [searchTerm, mostPopularProducts]);

  return (
    <div className="space-y-12">
      <div className="mb-8 animate-in fade-in slide-in-from-top-8 duration-500">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 text-base rounded-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {(loadingRecent || filteredRecentlyAdded.length > 0 || errorRecent || (searchTerm && filteredRecentlyAdded.length === 0)) && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          <div className="flex items-center mb-6">
            <Sparkles className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-headline font-semibold">{t('recentlyAdded')}</h2>
          </div>
          {errorRecent && (
             <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('error')}</AlertTitle>
              <AlertDescription>{errorRecent}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingRecent ? (
              Array.from({ length: 3 }).map((_, index) => <ProductCardSkeleton key={index} />)
            ) : filteredRecentlyAdded.length > 0 ? (
              filteredRecentlyAdded.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : searchTerm ? (
               <div className="col-span-full text-center py-10">
                 <p className="text-xl text-muted-foreground">{t('noProductsFound')}</p>
               </div>
            ) : null}
          </div>
        </section>
      )}

      {(loadingPopular || filteredMostPopular.length > 0 || errorPopular || (searchTerm && filteredMostPopular.length === 0)) && (
        <section className="animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out delay-200">
          <div className="flex items-center mb-6">
              <TrendingUp className="h-8 w-8 text-accent mr-3" />
              <h2 className="text-3xl font-headline font-semibold">{t('mostPopular')}</h2>
          </div>
          {errorPopular && (
             <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('error')}</AlertTitle>
              <AlertDescription>{errorPopular}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingPopular ? (
              Array.from({ length: 3 }).map((_, index) => <ProductCardSkeleton key={index} />)
            ) : filteredMostPopular.length > 0 ? (
              filteredMostPopular.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : searchTerm ? (
              <div className="col-span-full text-center py-10">
                 <p className="text-xl text-muted-foreground">{t('noProductsFound')}</p>
               </div>
            ) : null}
          </div>
        </section>
      )}
      
      {!loadingRecent && !loadingPopular && !errorRecent && !errorPopular && recentlyAddedProducts.length === 0 && mostPopularProducts.length === 0 && !searchTerm && (
         <div className="text-center py-10 animate-in fade-in duration-500">
            <p className="text-xl text-muted-foreground">No products available at the moment.</p>
          </div>
      )}

    </div>
  );
}
