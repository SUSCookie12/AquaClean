
'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, query, where, documentId, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
// Removed ScrollArea as it's not strictly needed for a short list of 3 + select
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Save, ListChecks, Info, ArrowUp, ArrowDown, XCircle, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const REQUIRED_POPULAR_PRODUCTS = 3;

export default function PopularProductsManager() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [orderedSelectedProducts, setOrderedSelectedProducts] = useState<Product[]>([]);
  const [availableProductsForSelection, setAvailableProductsForSelection] = useState<Product[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const settingsDocRef = doc(db, 'siteManagement', 'homeProd');

  const fetchProductsAndCurrentSelection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all products
      const productsSnapshot = await getDocs(query(collection(db, 'products'), orderBy('title', 'asc')));
      const allProductsList = productsSnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as Product));
      setAllProducts(allProductsList);

      // Fetch current popular product IDs from siteManagement/homeProd
      const settingsDoc = await getDoc(settingsDocRef);
      let popularProductIds: string[] = [];
      if (settingsDoc.exists() && settingsDoc.data()?.popularProductIds) {
        popularProductIds = settingsDoc.data()?.popularProductIds as string[];
      }

      if (popularProductIds.length > 0 && allProductsList.length > 0) {
          // Filter out IDs that no longer exist in allProductsList to prevent errors
          const existingPopularProductIds = popularProductIds.filter(id => allProductsList.some(p => p.id === id));

          if (existingPopularProductIds.length > 0) {
            // Fetch details for these popular products (this step might seem redundant if allProductsList has full data,
            // but it ensures we're working with the popular list specifically)
            // For simplicity, we can directly use allProductsList to find the product details
            const orderedList = existingPopularProductIds
              .map(id => allProductsList.find(p => p.id === id))
              .filter(p => p !== undefined) as Product[];
            setOrderedSelectedProducts(orderedList.slice(0, REQUIRED_POPULAR_PRODUCTS));
          } else {
            setOrderedSelectedProducts([]);
          }
      } else {
        setOrderedSelectedProducts([]);
      }

    } catch (err) {
      console.error("Error fetching products or settings:", err);
      setError(t('errorFetchingPopularProductsConfig'));
      setAllProducts([]); // Ensure allProducts is empty on error too
      setOrderedSelectedProducts([]);
    } finally {
      setLoading(false);
    }
  }, [t, settingsDocRef]); // Removed allProductsList from dependencies as it's defined inside

  useEffect(() => {
    fetchProductsAndCurrentSelection();
  }, [fetchProductsAndCurrentSelection]);

  useEffect(() => {
    // Update available products for selection
    const selectedIds = new Set(orderedSelectedProducts.map(p => p.id));
    setAvailableProductsForSelection(allProducts.filter(p => !selectedIds.has(p.id)));
  }, [allProducts, orderedSelectedProducts]);


  const handleAddProductToSelection = (productId: string) => {
    if (!productId) return; // productId can be "" if placeholder is somehow selected
    if (orderedSelectedProducts.length < REQUIRED_POPULAR_PRODUCTS) {
      const productToAdd = allProducts.find(p => p.id === productId);
      if (productToAdd) {
        setOrderedSelectedProducts(prev => [...prev, productToAdd]);
      }
    } else {
        toast({
            title: t('maxPopularProductsReachedTitle'),
            description: t('maxPopularProductsReachedDesc', { count: REQUIRED_POPULAR_PRODUCTS }),
            variant: 'destructive'
        });
    }
  };

  const handleRemoveProductFromSelection = (productIdToRemove: string) => {
    setOrderedSelectedProducts(prev => prev.filter(p => p.id !== productIdToRemove));
  };

  const handleMoveProduct = (productId: string, direction: 'up' | 'down') => {
    setOrderedSelectedProducts(prev => {
      const newOrder = [...prev];
      const index = newOrder.findIndex(p => p.id === productId);
      if (index === -1) return prev;

      if (direction === 'up' && index > 0) {
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      } else if (direction === 'down' && index < newOrder.length - 1) {
        [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
      }
      return newOrder;
    });
  };

  const handleSaveChanges = async () => {
    if (orderedSelectedProducts.length !== REQUIRED_POPULAR_PRODUCTS) {
      toast({
        title: t('exactPopularProductsRequiredTitle'),
        description: t('exactPopularProductsRequiredDesc', { count: REQUIRED_POPULAR_PRODUCTS }),
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    try {
      const productIdsToSave = orderedSelectedProducts.map(p => p.id);
      await setDoc(settingsDocRef, { popularProductIds: productIdsToSave }, { merge: true });
      toast({
        title: t('popularProductsUpdatedSuccessTitle'),
        description: t('popularProductsUpdatedSuccessDesc'),
      });
    } catch (err) {
      console.error("Error saving popular products:", err);
      toast({
        title: t('popularProductsUpdatedErrorTitle'),
        description: t('popularProductsUpdatedErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const canSaveChanges = orderedSelectedProducts.length === REQUIRED_POPULAR_PRODUCTS;

  if (loading) {
    return (
      <div className="space-y-4 p-1 sm:p-4 animate-pulse">
        <Skeleton className="h-12 w-full mb-2" /> {/* Alert skeleton */}
        <Skeleton className="h-10 w-full mb-4" /> {/* Section title skeleton */}
        <div className="border rounded-md p-1">
            {[...Array(REQUIRED_POPULAR_PRODUCTS)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 border-b rounded-md">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-grow"> <Skeleton className="h-4 w-3/4" /> <Skeleton className="h-3 w-1/2 mt-1" /> </div>
                <Skeleton className="h-8 w-8 rounded-full" /> <Skeleton className="h-8 w-8 rounded-full" /> <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            ))}
        </div>
        <Skeleton className="h-10 w-full sm:w-1/2 mt-2" /> {/* Add product select skeleton */}
        <Skeleton className="h-10 w-full sm:w-1/4 mt-4" /> {/* Save button skeleton */}
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
  
  // New: If not loading, no error, but no products in the system at all
  if (!loading && !error && allProducts.length === 0) {
    return (
      <div className="p-1 sm:p-4">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle>{t('noProductsInSystemTitlePPM') || "No Products Available"}</AlertTitle>
          <AlertDescription>
            {t('noProductsInSystemDescPPM') || "There are no products in your catalog to choose from for the 'Most Popular' section. Please add some products first via the 'Product Management' tab."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }


  return (
    <div className="space-y-6 p-1 sm:p-4">
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle>{t('howToManagePopularTitle')}</AlertTitle>
        <AlertDescription>
          {t('selectAndOrderPopularProductsDesc', { count: REQUIRED_POPULAR_PRODUCTS })}
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-headline">
            <ListChecks className="h-5 w-5 text-primary" /> 
            {t('currentPopularSelectionTitle', { count: orderedSelectedProducts.length, required: REQUIRED_POPULAR_PRODUCTS })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {orderedSelectedProducts.length === 0 && <p className="text-muted-foreground p-4 text-center">{t('noProductsCurrentlySelectedForPopular')}</p>}
          {orderedSelectedProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center space-x-2 sm:space-x-3 p-3 border rounded-lg bg-card hover:shadow-md transition-shadow"
            >
              <span className="font-bold text-primary text-lg hidden sm:inline">#{index + 1}</span>
              <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded overflow-hidden shrink-0">
                <Image
                  src={product.imageUrl || "https://placehold.co/100x100.png"}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 48px, 64px"
                  className="object-cover"
                  data-ai-hint={product.dataAiHint || "product thumbnail"}
                />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-medium text-sm truncate" title={product.title}>{product.title}</p>
                <p className="text-xs text-muted-foreground hidden sm:block truncate">ID: {product.id}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-1.5 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => handleMoveProduct(product.id, 'up')} disabled={index === 0} title={t('moveUp')}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleMoveProduct(product.id, 'down')} disabled={index === orderedSelectedProducts.length - 1} title={t('moveDown')}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveProductFromSelection(product.id)} className="text-destructive hover:text-destructive/80" title={t('remove')}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {orderedSelectedProducts.length < REQUIRED_POPULAR_PRODUCTS && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-headline">{t('addProductToPopularTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Select 
              onValueChange={(value) => { if(value) handleAddProductToSelection(value); }} 
              disabled={availableProductsForSelection.length === 0 || orderedSelectedProducts.length >= REQUIRED_POPULAR_PRODUCTS}
              value="" // Keep select reset unless we manage its value explicitly
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder={t('selectProductToAddPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {availableProductsForSelection.length === 0 ? (
                  <SelectItem value="-" disabled>
                    {orderedSelectedProducts.length >= REQUIRED_POPULAR_PRODUCTS 
                      ? t('maxPopularProductsReachedSelection') // New key for when max is reached
                      : t('noMoreProductsAvailable')}
                  </SelectItem>
                ) : (
                  availableProductsForSelection.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {/* Button is somewhat redundant if onValueChange works, but can be kept for explicit action */}
            {/* <Button onClick={() => {  }} 
                    disabled={availableProductsForSelection.length === 0 || orderedSelectedProducts.length >= REQUIRED_POPULAR_PRODUCTS}
                    className="hidden">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('add')}
            </Button> */}
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSaveChanges} disabled={saving || loading || !canSaveChanges} className="w-full sm:w-auto min-w-[150px] text-base py-3 sm:py-2">
        {saving ? t('saving') : (
          <> <Save className="mr-2 h-4 w-4" /> {t('saveChanges')} </>
        )}
      </Button>
      {!canSaveChanges && !loading && (
        <p className="text-sm text-destructive text-center sm:text-left">{t('mustSelectAndOrderExactlyProductsToSave', { count: REQUIRED_POPULAR_PRODUCTS })}</p>
      )}
    </div>
  );
}

