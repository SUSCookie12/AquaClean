'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/types';

const productSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductForm() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        ...data,
        currency: 'BGN',
      };
      
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: t('productAddedSuccess'),
        description: `${data.title} ${t('productAddedSuccess').toLowerCase()}`,
      });
      form.reset();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: t('productAddedError'),
        variant: 'destructive',
      });
    }
  };

  return (
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
          {form.formState.isSubmitting ? t('loading') : t('submit')}
        </Button>
      </form>
    </Form>
  );
}
