import { SITE_NAME } from '@/constants';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t mt-12">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; {currentYear} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
