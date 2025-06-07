
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart'; // Import useCart
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Edit, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { addToCart } = useCart(); // Get addToCart function
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const productDocRef = doc(db, 'products', productId);
        const productDoc = await getDoc(productDocRef);

        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() } as Product);
        } else {
          setError(t('productNotFound'));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, t]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, product.title);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="w-full h-80 md:h-[500px] rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-12 w-full sm:w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/products')} className="mt-8">{t('allProducts')}</Button>
      </div>
    );
  }

  if (!product) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('productNotFound')}</AlertTitle>
        </Alert>
        <Button onClick={() => router.push('/products')} className="mt-8">{t('allProducts')}</Button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat(language === 'bg' ? 'bg-BG' : 'en-US', {
    style: 'currency',
    currency: product.currency || 'BGN', // Fallback for currency
  }).format(product.price);

  const imageSrc = product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl : "https://placehold.co/800x600.png";

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0 md:gap-x-10">
          <div className="relative aspect-[4/3] w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] md:h-full">
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              data-ai-hint={product.dataAiHint || "product detail image"}
              priority
            />
          </div>
          <div className="flex flex-col p-6 md:p-8">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-headline mb-3">{product.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow mb-8">
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{product.description}</p>
            </CardContent>
            <div className="mt-auto space-y-6">
              <p className="text-3xl sm:text-4xl font-semibold text-primary">{formattedPrice}</p>
              <CardFooter className="p-0">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button 
                    onClick={handleAddToCart} 
                    className="flex-1 text-base h-10 px-4 py-2 sm:h-11 sm:px-8"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> {t('addToCart')}
                  </Button>
                  {isAdmin && user && (
                    <Button 
                      asChild 
                      variant="outline" 
                      className="flex-1 text-base h-10 px-4 py-2 sm:h-11 sm:px-8"
                    >
                      <Link href={`/products/${product.id}/edit`}>
                        <Edit className="mr-2 h-5 w-5" /> {t('editProduct')}
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
