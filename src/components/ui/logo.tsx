import Link from 'next/link';
import { Droplets } from 'lucide-react'; // Ocean/Cleanliness related icon
import { SITE_NAME } from '@/constants';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors">
      <Droplets size={28} />
      <span className="font-headline text-2xl font-bold">{SITE_NAME}</span>
    </Link>
  );
};

export default Logo;
