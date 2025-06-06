
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg rounded-lg">
      <CardHeader className="p-0">
        <Skeleton className="aspect-[4/3] w-full" />
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-1/3 mt-2" />
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default ProductCardSkeleton;
