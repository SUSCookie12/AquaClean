
'use client';

import type { Product, CartItem } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { useLanguage } from '@/hooks/use-language';
import { Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import Link from 'next/link';

interface CartItemRowProps {
  cartItem: CartItem;
  product: Product | null | undefined; // Product can be null if not found or still loading
}

export default function CartItemRow({ cartItem, product }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { t, language } = useLanguage();

  if (!product) {
    // Handle case where product data is not available (e.g., loading or error)
    // You might want a skeleton or a "product not found" message here
    return (
      <tr>
        <td colSpan={5} className="py-4 text-center text-muted-foreground">
          {t('loadingProductDetails')}
        </td>
      </tr>
    );
  }

  const imageSrc = product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl : "https://placehold.co/100x100.png";
  const formattedPrice = new Intl.NumberFormat(language === 'bg' ? 'bg-BG' : 'en-US', {
    style: 'currency',
    currency: product.currency,
  }).format(product.price);
  const formattedTotalPrice = new Intl.NumberFormat(language === 'bg' ? 'bg-BG' : 'en-US', {
    style: 'currency',
    currency: product.currency,
  }).format(product.price * cartItem.quantity);

  return (
    <tr className="border-b">
      <td className="py-4 pr-2">
        <div className="flex items-center space-x-3">
          <Link href={`/products/${product.id}`}>
            <div className="relative h-20 w-20 rounded overflow-hidden">
              <Image
                src={imageSrc}
                alt={product.title}
                fill
                sizes="80px"
                className="object-cover"
                data-ai-hint={product.dataAiHint || "product thumbnail"}
              />
            </div>
          </Link>
          <div>
            <Link href={`/products/${product.id}`} className="font-medium hover:underline">
              {product.title}
            </Link>
            <p className="text-sm text-muted-foreground hidden md:block">{product.description.substring(0,50)}...</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-2 text-center">{formattedPrice}</td>
      <td className="py-4 px-2">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
            disabled={cartItem.quantity <= 1}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={cartItem.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value, 10);
              if (!isNaN(newQuantity) && newQuantity > 0) {
                updateQuantity(product.id, newQuantity);
              } else if (e.target.value === '') {
                 // Allow clearing input, handle as 1 or remove on blur/submit
              }
            }}
            onBlur={(e) => { // Ensure quantity is at least 1 on blur
                const currentVal = parseInt(e.target.value, 10);
                if (isNaN(currentVal) || currentVal < 1) {
                    updateQuantity(product.id, 1);
                }
            }}
            className="h-8 w-14 text-center px-1"
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </td>
      <td className="py-4 px-2 text-center">{formattedTotalPrice}</td>
      <td className="py-4 pl-2 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/80"
          onClick={() => removeFromCart(product.id)}
        >
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">{t('remove')}</span>
        </Button>
      </td>
    </tr>
  );
}
