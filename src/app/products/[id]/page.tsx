
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
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="w-full h-96 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/products')} className="mt-4">{t('allProducts')}</Button>
      </div>
    );
  }

  if (!product) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('productNotFound')}</AlertTitle>
        </Alert>
        <Button onClick={() => router.push('/products')} className="mt-4">{t('allProducts')}</Button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat(language === 'bg' ? 'bg-BG' : 'en-US', {
    style: 'currency',
    currency: product.currency || 'BGN', // Fallback for currency
  }).format(product.price);

  const imageSrc = product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl : "https://placehold.co/800x600.png";

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0 md:gap-6">
          <div className="relative aspect-[4/3] md:aspect-auto w-full md:h-full min-h-[300px] md:min-h-[400px]">
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
          <div className="flex flex-col">
            <CardHeader className="pt-6 px-6">
              <CardTitle className="text-3xl lg:text-4xl font-headline mb-3">{product.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 flex-grow">
              <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">{product.description}</p>
              <p className="text-3xl font-semibold text-primary mb-6">{formattedPrice}</p>
            </CardContent>
            <CardFooter className="p-6 border-t md:border-t-0 md:mt-auto">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> {t('addToCart')}
                </Button>
                {isAdmin && user && (
                  <Button asChild variant="outline" size="lg" className="flex-1">
                    <Link href={`/products/${product.id}/edit`}>
                      <Edit className="mr-2 h-5 w-5" /> {t('editProduct')}
                    </Link>
                  </Button>
                )}
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}

