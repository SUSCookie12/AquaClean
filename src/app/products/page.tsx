
'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/product/product-card';
import ProductCardSkeleton from '@/components/product/product-card-skeleton';
import type { Product } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Search, AlertTriangle } from 'lucide-react';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProductsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('title', 'asc'));
        const querySnapshot = await getDocs(q);
        const productsList: Product[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt as Timestamp | undefined,
          updatedAt: doc.data().updatedAt as Timestamp | undefined,
        } as Product));
        setAllProducts(productsList);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return allProducts;
    }
    return allProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, allProducts]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-500">
        <div className="flex items-center">
          <ShoppingBag className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-headline font-semibold">{t('allProducts')}</h1>
        </div>
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
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
      
      {error && (
        <Alert variant="destructive" className="animate-in fade-in duration-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 animate-in fade-in duration-500">
          <p className="text-xl text-muted-foreground">
            {searchTerm ? t('noProductsFound') : "No products available at the moment."}
          </p>
        </div>
      )}
    </div>
  );
}
