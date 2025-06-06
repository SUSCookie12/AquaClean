
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const productSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal("")), // Allow empty for placeholder
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  dataAiHint: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      dataAiHint: '',
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/'); // Redirect if not logged in
    } else if (!authLoading && user && !isAdmin) {
      router.push('/'); // Redirect if logged in but not admin
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!productId || !isAdmin) return; // Don't fetch if no ID or not admin (though redirect should handle)

    const fetchProduct = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const productDocRef = doc(db, 'products', productId);
        const productDoc = await getDoc(productDocRef);

        if (productDoc.exists()) {
          const fetchedProduct = { id: productDoc.id, ...productDoc.data() } as Product;
          setProduct(fetchedProduct);
          form.reset({
            title: fetchedProduct.title,
            description: fetchedProduct.description,
            imageUrl: fetchedProduct.imageUrl,
            price: fetchedProduct.price,
            dataAiHint: fetchedProduct.dataAiHint || '',
          });
        } else {
          setError(t('productNotFound'));
        }
      } catch (err) {
        console.error("Error fetching product for edit:", err);
        setError(t('error'));
      } finally {
        setInitialLoading(false);
      }
    };

    if (isAdmin) { // Only fetch if admin to avoid unnecessary calls before redirect
        fetchProduct();
    }
  }, [productId, t, form, isAdmin]);

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;
    try {
      const productDocRef = doc(db, 'products', product.id);
      await updateDoc(productDocRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: t('productUpdatedSuccess'),
        description: `${data.title} ${t('productUpdatedSuccess').toLowerCase()}`,
      });
      router.push(`/products/${product.id}`); // Redirect to product detail page
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: t('productUpdatedError'),
        variant: 'destructive',
      });
    }
  };

  if (authLoading || initialLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!isAdmin && !authLoading) {
     // This case should ideally be handled by the redirect, but as a fallback:
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You do not have permission to view this page. Redirecting...
              </AlertDescription>
            </Alert>
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
        <Button onClick={() => router.push('/admin')} className="mt-4">{t('admin')}</Button>
      </div>
    );
  }

  if (!product && !initialLoading) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('productNotFound')}</AlertTitle>
        </Alert>
         <Button onClick={() => router.push('/admin')} className="mt-4">{t('admin')}</Button>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('editProduct')}: {product?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow-md">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('title')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('title')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('description')} {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('imageUrl')}</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dataAiHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Image Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'detergent bottle' or 'cleaning supplies'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('price')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="19.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('loading') : t('saveChanges')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
