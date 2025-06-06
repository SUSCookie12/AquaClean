
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useLanguage } from '@/hooks/use-language';
import type { Product, CartItem } from '@/types';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, documentId } from 'firebase/firestore';
import CartItemRow from '@/components/cart/cart-item-row';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ShoppingCart, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductWithQuantity extends Product {
  quantity: number;
}

export default function CartPage() {
  const { cartItems, loadSharedCart, clearCart, isCartEmpty: isCartContextEmpty, rawCartItems } = useCart();
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [productsData, setProductsData] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSharedCartDialog, setShowSharedCartDialog] = useState(false);
  const [sharedCartToLoad, setSharedCartToLoad] = useState<CartItem[] | null>(null);


  useEffect(() => {
    const sharedItemsParam = searchParams.get('sharedItems');
    if (sharedItemsParam) {
      try {
        const parsedItems: CartItem[] = sharedItemsParam.split(',').map(itemStr => {
          const [productId, quantityStr] = itemStr.split('_');
          const quantity = parseInt(quantityStr, 10);
          if (!productId || isNaN(quantity) || quantity <= 0) {
            throw new Error('Invalid shared item format');
          }
          return { productId, quantity };
        });
        setSharedCartToLoad(parsedItems);
        setShowSharedCartDialog(true);
      } catch (e) {
        console.error("Failed to parse shared cart items:", e);
        toast({ title: t('error'), description: t('invalidSharedCartLink'), variant: 'destructive' });
        router.replace('/cart', undefined); 
      }
    }
  }, [searchParams, router, t, toast]);


  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setLoading(false);
      setProductsData({});
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const productIds = cartItems.map(item => item.productId);
      if (productIds.length === 0) {
        setProductsData({});
        setLoading(false);
        return;
      }

      try {
        const productsRef = collection(db, 'products');
        if (productIds.length > 30) {
            console.warn("Cart has more than 30 unique items. Fetching might be incomplete due to Firestore 'in' query limits.");
        }
        const q = query(productsRef, where(documentId(), 'in', productIds.slice(0,30)));
        const querySnapshot = await getDocs(q);
        
        const fetchedProducts: Record<string, Product> = {};
        querySnapshot.forEach((docSnap) => {
          fetchedProducts[docSnap.id] = { id: docSnap.id, ...docSnap.data() } as Product;
        });
        setProductsData(fetchedProducts);
      } catch (err) {
        console.error("Error fetching cart products:", err);
        setError(t('errorFetchingCartDetails'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cartItems, t]);

  const detailedCartItems: ProductWithQuantity[] = useMemo(() => {
    return cartItems
      .map(cartItem => {
        const product = productsData[cartItem.productId];
        return product ? { ...product, quantity: cartItem.quantity } : null;
      })
      .filter(item => item !== null) as ProductWithQuantity[];
  }, [cartItems, productsData]);

  const cartTotal = useMemo(() => {
    return detailedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [detailedCartItems]);

  const formattedCartTotal = new Intl.NumberFormat(language === 'bg' ? 'bg-BG' : 'en-US', {
    style: 'currency',
    currency: detailedCartItems[0]?.currency || 'BGN',
  }).format(cartTotal);

  const handleShareCart = () => {
    if (rawCartItems.length === 0) {
      toast({ title: t('cartIsEmpty'), description: t('cannotShareEmptyCart'), variant: 'destructive'});
      return;
    }
    const sharedItemsString = rawCartItems.map(item => `${item.productId}_${item.quantity}`).join(',');
    const shareUrl = `${window.location.origin}/cart?sharedItems=${sharedItemsString}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({ title: t('cartLinkCopiedTitle'), description: t('cartLinkCopiedDesc') });
    }).catch(err => {
      console.error('Failed to copy cart link: ', err);
      toast({ title: t('error'), description: t('failedToCopyLink'), variant: 'destructive'});
    });
  };
  
  const handleLoadSharedCartConfirm = () => {
    if (sharedCartToLoad) {
      loadSharedCart(sharedCartToLoad);
    }
    setShowSharedCartDialog(false);
    setSharedCartToLoad(null);
    router.replace('/cart', undefined); 
  };

  const handleLoadSharedCartCancel = () => {
    setShowSharedCartDialog(false);
    setSharedCartToLoad(null);
    router.replace('/cart', undefined); 
  };


  if (loading && cartItems.length > 0) { 
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5 md:min-w-[250px]">{t('product')}</TableHead>
                  <TableHead className="text-center md:min-w-[100px]">{t('price')}</TableHead>
                  <TableHead className="text-center md:min-w-[150px]">{t('quantity')}</TableHead>
                  <TableHead className="text-center md:min-w-[100px]">{t('total')}</TableHead>
                  <TableHead className="text-right md:min-w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2].map(i => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-20 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 sm:w-20 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 sm:w-24 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 sm:w-20 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-6 gap-4">
            <Skeleton className="h-10 w-24 sm:w-32" />
            <Skeleton className="h-10 w-32 sm:w-40" />
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="animate-in fade-in duration-300">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('error')}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isCartContextEmpty() && !loading) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h2 className="text-3xl font-headline mb-4">{t('yourCartIsEmpty')}</h2>
        <p className="text-muted-foreground mb-8">{t('yourCartIsEmptyDesc')}</p>
        <Button asChild size="lg">
          <Link href="/products">{t('startShopping')}</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h1 className="text-3xl font-headline font-semibold animate-in fade-in slide-in-from-top-8 duration-500">{t('shoppingCart')}</h1>
      <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px] w-2/5 sm:min-w-[250px]">{t('product')}</TableHead>
                  <TableHead className="text-center min-w-[80px] sm:min-w-[100px]">{t('price')}</TableHead>
                  <TableHead className="text-center min-w-[120px] sm:min-w-[150px]">{t('quantity')}</TableHead>
                  <TableHead className="text-center min-w-[80px] sm:min-w-[100px]">{t('total')}</TableHead>
                  <TableHead className="text-right min-w-[40px] sm:min-w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedCartItems.map(item => (
                  <CartItemRow key={item.id} cartItem={{productId: item.id, quantity: item.quantity}} product={item} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4 border-t">
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleShareCart} disabled={isCartContextEmpty()} className="w-full xs:w-auto">
              <Share2 className="mr-2 h-4 w-4" />
              {t('shareCart')}
            </Button>
            <Button variant="destructive" onClick={clearCart} disabled={isCartContextEmpty()} className="w-full xs:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              {t('clearCart')}
            </Button>
          </div>
          <div className="text-right space-y-1 w-full sm:w-auto pt-4 sm:pt-0">
            <p className="text-xl sm:text-2xl font-semibold">{t('grandTotal')}: {formattedCartTotal}</p>
          </div>
        </CardFooter>
      </Card>

      {showSharedCartDialog && (
        <AlertDialog open={showSharedCartDialog} onOpenChange={setShowSharedCartDialog}>
          <AlertDialogContent className="animate-in fade-in zoom-in-95 duration-300">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('loadSharedCartTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('loadSharedCartDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleLoadSharedCartCancel}>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLoadSharedCartConfirm}>{t('loadCart')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
