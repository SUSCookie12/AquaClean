
import Image from 'next/image';
import type { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Eye } from 'lucide-react'; 

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const formattedPrice = new Intl.NumberFormat(language === 'bg' ? 'bg-BG' : 'en-US', {
    style: 'currency',
    currency: product.currency,
  }).format(product.price);

  const imageSrc = product.imageUrl && product.imageUrl.trim() !== '' ? product.imageUrl : `https://placehold.co/600x400.png`;

  const handleAddToCart = () => {
    addToCart(product.id, product.title);
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out rounded-lg group animate-in fade-in zoom-in-95">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block aspect-[4/3] relative w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            data-ai-hint={product.dataAiHint || "product image"}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-headline mb-2 h-14 line-clamp-2">
          <Link href={`/products/${product.id}`} className="hover:underline">
            {product.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3 h-[3.75rem] mb-2">
          {product.description}
        </p>
        <p className="text-xl font-semibold text-primary">{formattedPrice}</p>
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-col sm:flex-row gap-2">
        <Button asChild className="w-full sm:flex-1" variant="outline">
          <Link href={`/products/${product.id}`}> 
            <Eye className="mr-2 h-4 w-4" /> {t('viewProduct')}
          </Link>
        </Button>
        <Button onClick={handleAddToCart} className="w-full sm:flex-1" variant="default">
          <ShoppingCart className="mr-2 h-4 w-4" /> {t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

