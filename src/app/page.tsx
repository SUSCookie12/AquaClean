
'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/product/product-card';
import ProductCardSkeleton from '@/components/product/product-card-skeleton';
import type { Product } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Search, AlertTriangle, ArrowRight } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit, Timestamp, doc, getDoc, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SITE_NAME } from '@/constants';
import Link from 'next/link';
import InstallPrompt from '@/components/pwa/install-prompt'; // Import the InstallPrompt component

const REQUIRED_POPULAR_PRODUCTS_COUNT = 3;

export default function HomePage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [recentlyAddedProducts, setRecentlyAddedProducts] = useState<Product[]>([]);
  const [mostPopularProducts, setMostPopularProducts] = useState<Product[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [errorRecent, setErrorRecent] = useState<string | null>(null);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);
  const [popularProductsConfiguredCorrectly, setPopularProductsConfiguredCorrectly] = useState(false);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      setLoadingRecent(true);
      setErrorRecent(null);
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('createdAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        const products: Product[] = querySnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt as Timestamp | undefined,
          updatedAt: docSnap.data().updatedAt as Timestamp | undefined,
        } as Product));
        setRecentlyAddedProducts(products);
      } catch (err) {
        console.error("Error fetching recent products:", err);
        setErrorRecent(t('errorFetchingRecentProducts'));
      } finally {
        setLoadingRecent(false);
      }
    };

    const fetchPopularProducts = async () => {
      setLoadingPopular(true);
      setErrorPopular(null);
      setPopularProductsConfiguredCorrectly(false);
      try {
        const settingsDocRef = doc(db, 'siteManagement', 'homeProd');
        const settingsDoc = await getDoc(settingsDocRef);
        let popularIds: string[] = [];

        if (settingsDoc.exists() && settingsDoc.data()?.popularProductIds) {
          popularIds = settingsDoc.data()?.popularProductIds as string[];
        }
        
        if (popularIds.length === REQUIRED_POPULAR_PRODUCTS_COUNT) {
          const productsRef = collection(db, 'products');
          // Firestore 'in' query can fetch up to 30 items, but we only need 3.
          // Fetching specific IDs doesn't guarantee order if the number of IDs is > 10 in some complex 'in' queries,
          // but for a small, specific set like 3, it's generally reliable. We re-order explicitly later.
          const q = query(productsRef, where(documentId(), 'in', popularIds.slice(0, REQUIRED_POPULAR_PRODUCTS_COUNT)));
          const querySnapshot = await getDocs(q);
          
          const fetchedProductsMap = new Map<string, Product>();
          querySnapshot.forEach((docSnap) => {
            fetchedProductsMap.set(docSnap.id, {
              id: docSnap.id,
              ...docSnap.data(),
              createdAt: docSnap.data().createdAt as Timestamp | undefined,
              updatedAt: docSnap.data().updatedAt as Timestamp | undefined,
            } as Product);
          });

          // Restore order from popularIds
          const orderedPopularProducts = popularIds
            .map(id => fetchedProductsMap.get(id))
            .filter(p => p !== undefined) as Product[];
          
          if (orderedPopularProducts.length === REQUIRED_POPULAR_PRODUCTS_COUNT) {
            setMostPopularProducts(orderedPopularProducts);
            setPopularProductsConfiguredCorrectly(true);
          } else {
            console.warn(`Could not fetch all ${REQUIRED_POPULAR_PRODUCTS_COUNT} configured popular products. Fetched ${orderedPopularProducts.length}. Displaying none.`);
            setMostPopularProducts([]);
            setPopularProductsConfiguredCorrectly(false); 
            // setErrorPopular(t('errorFetchingConfiguredPopularProducts')); // Optional
          }
        } else {
          setMostPopularProducts([]); 
          setPopularProductsConfiguredCorrectly(false); 
          if (popularIds.length > 0) { 
             console.warn(`Popular products incorrectly configured. Expected ${REQUIRED_POPULAR_PRODUCTS_COUNT}, found ${popularIds.length}.`);
          }
        }
      } catch (err) {
        console.error("Error fetching popular products settings:", err);
        setErrorPopular(t('errorFetchingPopularProducts'));
        setMostPopularProducts([]);
        setPopularProductsConfiguredCorrectly(false);
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
  
  const showPopularSection = popularProductsConfiguredCorrectly && (filteredMostPopular.length > 0 || loadingPopular) && !errorPopular;


  return (
    <div className="space-y-16 md:space-y-20"> {/* Adjusted main spacing */}
      {/* Hero Section */}
      <section className="text-center py-16 md:py-28 min-h-[60vh] md:min-h-[50vh] flex flex-col justify-center items-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-headline font-bold text-primary animate-in fade-in-0 slide-in-from-top-12 duration-1000 ease-out">
          {SITE_NAME}
        </h1>
        <p className="mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-xl md:max-w-2xl animate-in fade-in-0 slide-in-from-top-16 duration-1000 ease-out delay-200">
          {t('heroTagline')}
        </p>
        <Button asChild size="lg" className="mt-8 md:mt-10 text-base md:text-lg py-3 md:py-3.5 px-6 md:px-8 animate-in fade-in-0 slide-in-from-top-20 duration-1000 ease-out delay-400">
          <Link href="/products">
            {t('heroCTA')} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Search Bar Section */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out delay-500 pb-8 md:pb-0">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 text-base rounded-lg shadow-md focus:shadow-lg transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Recently Added Products Section */}
      {(loadingRecent || filteredRecentlyAdded.length > 0 || errorRecent || (searchTerm && filteredRecentlyAdded.length === 0)) && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out delay-200">
          <div className="flex items-center mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingRecent ? (
              Array.from({ length: 3 }).map((_, index) => <ProductCardSkeleton key={index} />)
            ) : filteredRecentlyAdded.length > 0 ? (
              filteredRecentlyAdded.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : searchTerm && !errorRecent ? ( 
               <div className="col-span-full text-center py-10">
                 <p className="text-xl text-muted-foreground">{t('noProductsFound')}</p>
               </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Most Popular Products Section */}
      {showPopularSection && (
        <section className="animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out delay-300">
          <div className="flex items-center mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingPopular ? (
              Array.from({ length: REQUIRED_POPULAR_PRODUCTS_COUNT }).map((_, index) => <ProductCardSkeleton key={index} />)
            ) : filteredMostPopular.length > 0 ? (
              filteredMostPopular.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : searchTerm && popularProductsConfiguredCorrectly && !errorPopular ? ( 
              <div className="col-span-full text-center py-10">
                 <p className="text-xl text-muted-foreground">{t('noProductsFound')}</p>
               </div>
            ) : null}
          </div>
        </section>
      )}
      
      {!loadingRecent && !loadingPopular && !errorRecent && !errorPopular && recentlyAddedProducts.length === 0 && !showPopularSection && !searchTerm && (
         <div className="text-center py-10 animate-in fade-in duration-500">
            <p className="text-xl text-muted-foreground">{t('noProductsAvailable')}</p>
          </div>
      )}
      <InstallPrompt /> {/* Add the install prompt component here */}
    </div>
  );
}
