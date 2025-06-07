
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/types';
import { PackagePlus } from 'lucide-react';

const productSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }).max(100, { message: 'Title must be 100 characters or less.'}),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(500, {message: 'Description must be 500 characters or less.'}),
  imageUrl: z.string().url({ message: 'Please enter a valid URL for the image.' }),
  dataAiHint: z.string().max(50, {message: "AI hint must be 50 characters or less."}).optional().describe("Keywords for AI image search, e.g., 'detergent bottle' or 'blue liquid'"),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  currency: z.literal('BGN').default('BGN'),
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
      dataAiHint: '',
      price: 0,
      currency: 'BGN',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Ensure dataAiHint is either a string or undefined, not null
      const productDataForFirestore = {
        ...data,
        dataAiHint: data.dataAiHint || '', // Convert empty or undefined to empty string if needed by Firestore rules or preference
      };

      await addDoc(collection(db, 'products'), {
        ...productDataForFirestore,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: t('productAddedSuccess'),
        description: `${data.title} ${t('hasBeenAddedToCatalog')}`,
      });
      form.reset();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: t('productAddedError'),
        description: t('productAddedErrorDesc') || 'There was an issue adding the product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1 sm:p-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('productNamePlaceholder') || "e.g., Ultra Clean Laundry Detergent"} {...field} />
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
                <Textarea placeholder={t('productDescriptionPlaceholder') || "Describe the product's features and benefits..."} {...field} className="min-h-[100px]" />
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
                <Input type="url" placeholder="https://placehold.co/600x400.png" {...field} />
              </FormControl>
              <FormDescription>
                {t('imageUrlHelpText') || "Link to the product image. Use a placeholder if needed."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('aiImageHintLabel') || "AI Image Hint (Optional)"}</FormLabel>
              <FormControl>
                <Input placeholder={t('aiImageHintPlaceholder') || "e.g., 'detergent bottle' or 'cleaning supplies'"} {...field} />
              </FormControl>
               <FormDescription>
                {t('aiImageHintDesc') || "One or two keywords for AI image search if the main URL is a placeholder."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('price')} ({form.watch('currency')})</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="19.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Currency is fixed to BGN for now, can be a Select if multiple currencies are needed */}
        {/* <FormField
          control={form.control}
          name="currency"
          render={({ field }) => ( ... )}
        /> */}
        <Button type="submit" className="w-full text-base py-3" disabled={form.formState.isSubmitting}>
          <PackagePlus className="mr-2 h-5 w-5" />
          {form.formState.isSubmitting ? t('submitting') : t('addProductButton')}
        </Button>
      </form>
    </Form>
  );
}
